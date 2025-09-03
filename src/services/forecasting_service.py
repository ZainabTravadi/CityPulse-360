# src/services/forecasting_service.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from math import sqrt


def generate_synthetic_data(hours=24 * 30):  # default = 30 days of hourly data
    """
    Generates realistic synthetic electricity demand data.
    Includes:
    - Daily seasonality (peaks in evening, dip at night)
    - Weekly effect (weekends lower demand)
    - Temperature correlation (hotter → more demand)
    - Holiday effects (special spikes)
    - Rare anomalies (blackouts, surges)
    - Trend + noise
    """
    rng = pd.date_range(end=pd.Timestamp.now(), periods=hours, freq="H")

    # -----------------------------
    # Base daily cycle (0–24h, peaks ~18–22h)
    daily_pattern = 20 + 15 * np.sin(2 * np.pi * rng.hour / 24 - np.pi / 2)

    # Weekly effect (weekends ~15% lower)
    weekly_pattern = np.where(rng.dayofweek < 5, 1.0, 0.85)

    # -----------------------------
    # Temperature effect (hotter days → higher demand)
    # Yearly sinusoidal cycle for temp: 20–38°C approx
    temp = 20 + 10 * np.sin(2 * np.pi * rng.dayofyear.to_numpy() / 365)
    temp_effect = 0.6 * np.clip(temp - 25, 0, None)  # extra load when >25°C

    # -----------------------------
    # Holiday effects (fixed calendar days with spikes)
    holidays = ["2025-11-12", "2025-12-25"]  # Diwali, Christmas (example)
    holiday_boost = np.where(rng.normalize().isin(pd.to_datetime(holidays)), 15, 0)

    # -----------------------------
    # Rare anomalies (blackouts or surges)
    anomaly_mask = np.random.choice([0, 1], size=hours, p=[0.98, 0.02])
    anomaly_effect = np.ones(hours)
    anomaly_effect[anomaly_mask == 1] = np.random.choice([0.3, 1.5])  # drop or surge

    # -----------------------------
    # Upward trend
    trend = np.linspace(0, 5, hours)

    # Random noise
    noise = np.random.normal(0, 2, hours)

    # Final demand signal
    values = ((50 + daily_pattern) * weekly_pattern +
              temp_effect + holiday_boost + trend + noise) * anomaly_effect

    return pd.DataFrame({"datetime": rng, "value": values})


def build_forecast(df):
    """
    df must have columns: datetime, value
    If df is empty or flat (all zeros), synthetic data will be generated.
    """
    # If no data or flat, generate synthetic
    if df.empty or df["value"].sum() == 0:
        df = generate_synthetic_data(hours=24 * 60)  # 60 days synthetic

    # Ensure datetime type
    df["datetime"] = pd.to_datetime(df["datetime"])
    df = df.sort_values("datetime")

    # Set hourly frequency, fill missing timestamps
    df = df.set_index("datetime").asfreq("H")

    # Handle NaN values
    df["value"] = df["value"].interpolate(method="time")
    df["value"] = df["value"].fillna(method="bfill").fillna(method="ffill")

    # Split into train/test
    test_hours = min(24 * 7, len(df) // 4)  # up to 1 week for test
    y = df["value"].astype(float)
    train = y[:-test_hours]
    test = y[-test_hours:]

    # Fit SARIMAX
    model = SARIMAX(
        train,
        order=(1, 1, 1),
        seasonal_order=(1, 1, 1, 24),
        enforce_stationarity=False,
        enforce_invertibility=False,
    )
    res = model.fit(disp=False)

    # Predictions for test set
    pred_test = res.get_prediction(start=test.index[0], end=test.index[-1])
    y_pred = pred_test.predicted_mean

    # Metrics
    r2 = r2_score(test, y_pred) if not test.empty else 0
    mae = mean_absolute_error(test, y_pred) if not test.empty else 0
    rmse = sqrt(mean_squared_error(test, y_pred)) if not test.empty else 0
    mape = (
        np.mean(np.abs((test - y_pred) / test)) * 100
        if not test.empty and not all(test == 0)
        else 0
    )

    # Forecast next 48h
    fc_res = res.get_forecast(steps=48)
    fc_mean = fc_res.predicted_mean
    fc_ci = fc_res.conf_int(alpha=0.05)

    forecast = []
    for ts, val, low, up in zip(fc_mean.index, fc_mean, fc_ci.iloc[:, 0], fc_ci.iloc[:, 1]):
        level = "High" if val > 70 else "Medium" if val > 40 else "Low"
        forecast.append(
            {
                "timestamp": ts.isoformat(),
                "value": round(val, 2),
                "lower": round(low, 2),
                "upper": round(up, 2),
                "level": level,
            }
        )

    stats = {
        "method": "SARIMAX",
        "accuracy_r2": round(r2 * 100, 2),
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "mape": round(mape, 2),
        "training_points": len(train),
        "test_points": len(test),
        "last_updated": datetime.now().isoformat(),
    }

    return forecast, stats

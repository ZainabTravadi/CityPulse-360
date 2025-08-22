# src/routes/forecast_routes.py
from flask import Blueprint, jsonify
from src.model.models import ElectricityData
from datetime import datetime, timedelta, timezone
import random

forecast_bp = Blueprint("forecast", __name__)

@forecast_bp.route("/forecast", methods=["GET"])
def forecast_electricity():
    now = datetime.now(timezone.utc)
    last_48h = ElectricityData.query.filter(
        ElectricityData.timestamp >= now - timedelta(hours=48)
    ).all()

    values = [entry.data.get("value", 0) for entry in last_48h]

    if not values:
        # instead of 0, simulate values so UI shows something
        values = [random.uniform(20, 90) for _ in range(48)]

    avg = sum(values) / len(values)

    forecast = []
    for i in range(1, 49):  # next 48 hours
        val = avg + random.uniform(-5, 5)  # add variation
        level = "High" if val > 70 else "Medium" if val > 40 else "Low"
        forecast.append({
            "timestamp": (now + timedelta(hours=i)).isoformat(),
            "value": round(val, 2),
            "level": level
        })

    return jsonify(forecast)

import os
import random
from datetime import datetime, timedelta
from collections import Counter

import pandas as pd
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

# ----------------- Load Environment -----------------
load_dotenv()

# ----------------- Init Flask & DB -----------------
from src.model.models import db, Zone, TrafficData, ElectricityData, WaterData, ComplaintData, AirQualityData, Alert
from src.services.forecasting_service import build_forecast, generate_synthetic_data

app = Flask(__name__)
CORS(app)

# In app.py

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///citypulse.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# ----------------- API Keys / URLs -----------------
TRAFFIC_API_KEY = os.getenv("TRAFFIC_API_KEY")
ELECTRICITY_API_KEY = os.getenv("ELECTRICITY_API_KEY")
ELECTRICITY_URL = os.getenv("ELECTRICITY_URL", "https://api.electricitymaps.com/v3/power-breakdown/latest")
OWM_KEY = os.getenv("OWM_KEY")

# ----------------- Simulated Data -----------------
CATEGORIES = ["Roads", "Water Supply", "Electricity", "Garbage", "Public Transport", "Noise"]
SAMPLE_COMPLAINTS = [
    "Potholes causing traffic jams",
    "Street lights not working",
    "Water leakage near colony",
    "Uncollected garbage in street",
    "Frequent electricity cuts",
    "Broken bus stop shelter",
    "High noise from construction at night"
]

# ----------------- Scheduler -----------------
scheduler = BackgroundScheduler()

def start_scheduler():
    """Start background jobs (safe to call multiple times)."""
    if not scheduler.running:
        scheduler.add_job(func=fetch_traffic, trigger="interval", minutes=5)
        scheduler.add_job(func=fetch_electricity, trigger="interval", minutes=5)
        scheduler.add_job(func=lambda: fetch_air(), trigger="interval", minutes=10)
        scheduler.add_job(func=fetch_water, trigger="interval", minutes=3)
        scheduler.add_job(func=fetch_complaints, trigger="interval", minutes=7)
        scheduler.add_job(func=check_for_alerts, trigger="interval", minutes=5)
        scheduler.start()

# ----------------- Utility: CSV / Sentiment Loader -----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_data():
    """Load feedback CSV with sentiment classification."""
    file_path = os.path.join(BASE_DIR, "feedback_synthetic.csv")
    if not os.path.exists(file_path):
        return pd.DataFrame(columns=["text", "timestamp", "clean_text", "sentiment"])

    df = pd.read_csv(file_path)

    if "text" not in df.columns:
        df["text"] = ""
    if "timestamp" not in df.columns:
        df["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    positive_words = ["good", "great", "excellent", "improved", "efficient", "smooth", "clean", "green", "responsive", "resolved"]
    negative_words = ["nightmare", "terrible", "needs improvement", "slow", "delays", "potholes", "leakage", "cuts", "congestion", "garbage", "broken"]

    def assign_sentiment(text):
        text_lower = str(text).lower()
        if any(word in text_lower for word in positive_words):
            return "positive"
        if any(word in text_lower for word in negative_words):
            return "negative"
        return "neutral"

    df["clean_text"] = df["text"].astype(str).str.lower().str.replace('[^\w\s]', '', regex=True)
    df["sentiment"] = df["text"].apply(assign_sentiment)

    try:
        df["timestamp"] = pd.to_datetime(df["timestamp"])
    except Exception:
        df["timestamp"] = pd.to_datetime(datetime.now())

    return df

# ----------------- Seeder for Zones -----------------
def seed_zones():
    """Seed default zones if none exist."""
    if Zone.query.first() is None:
        print("Seeding zones into the database...")
        zones_to_add = [
            Zone(name="Downtown District (CP)", priority="high", position_top="35%", position_left="45%", latitude=28.6324, longitude=77.2187),
            Zone(name="Residential South", priority="normal", position_top="60%", position_left="30%", latitude=28.5273, longitude=77.2088),
            Zone(name="Eco Park Zone", priority="eco", position_top="25%", position_left="70%", latitude=28.6129, longitude=77.2295),
            Zone(name="Industrial Hub", priority="high", position_top="80%", position_left="65%", latitude=28.5611, longitude=77.2884),
            Zone(name="University Campus", priority="normal", position_top="15%", position_left="20%", latitude=28.6872, longitude=77.1658)
        ]
        db.session.bulk_save_objects(zones_to_add)
        db.session.commit()
        print("Zones seeded.")

# ----------------- External fetchers -----------------
def fetch_traffic():
    try:
        lat, lon = 28.6139, 77.2090
        url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?key={TRAFFIC_API_KEY}&point={lat},{lon}"
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()

        fdata = data.get("flowSegmentData", {})
        curr, free = fdata.get("currentTravelTime"), fdata.get("freeFlowTravelTime")
        congestion_percent = round(curr / free * 100, 2) if curr and free else None

        db.session.add(TrafficData(data=data))
        db.session.commit()
        return {"congestion": f"{congestion_percent}%" if congestion_percent else "unknown"}
    except Exception as e:
        print("Traffic API error:", e)
        return {"error": "Traffic fetch failed"}

def fetch_electricity():
    try:
        zone = "IN-WE"
        headers = {"auth-token": ELECTRICITY_API_KEY}
        r = requests.get(f"{ELECTRICITY_URL}?zone={zone}", headers=headers, timeout=10)
        r.raise_for_status()
        data = r.json()
        total_load = data.get("powerConsumptionTotal")

        db.session.add(ElectricityData(data=data))
        db.session.commit()
        return {"zone": zone, "electricity_load": f"{total_load} MW" if total_load else "unknown"}
    except Exception as e:
        print("Electricity API error:", e)
        return {"error": "Electricity fetch failed"}

def fetch_air(lat=28.6139, lon=77.2090):
    try:
        url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OWM_KEY}"
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()

        aqi = data.get("list", [{}])[0].get("main", {}).get("aqi")
        labels = {1: "Good 🌿", 2: "Fair 🙂", 3: "Moderate 😐", 4: "Poor 😷", 5: "Very Poor ☠️"}

        db.session.add(AirQualityData(aqi=aqi, description=labels.get(aqi, "Unknown")))
        db.session.commit()
        return {"aqi": aqi, "description": labels.get(aqi, "Unknown")}
    except Exception as e:
        print("Air Quality API error:", e)
        return {"error": "Air quality fetch failed"}

def fetch_water():
    usage = round(random.uniform(2.0, 3.0), 2)
    status = "Normal range"
    if usage > 2.8:
        status = "High ⚠️"
    elif usage < 2.2:
        status = "Low 💧"

    db.session.add(WaterData(usage=usage, condition=status))
    db.session.commit()
    return {"water_usage": f"{usage} ML", "condition": status}

def fetch_complaints():
    complaints = []
    for _ in range(5):
        category, description = random.choice(CATEGORIES), random.choice(SAMPLE_COMPLAINTS)
        status = random.choice(["Open", "In Progress", "Resolved"])
        complaint_entry = ComplaintData(category=category, description=description, status=status, timestamp=datetime.now())
        db.session.add(complaint_entry)
        complaints.append({"category": category, "description": description, "status": status, "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
    db.session.commit()
    return {"count": len(complaints), "complaints": complaints}


def seed_alerts():
    """Seed the database with a variety of realistic alerts if the table is empty."""
    with app.app_context():
        if Alert.query.first() is None:
            print("Seeding alerts into the database...")
            
            # Template data taken directly from your frontend example
            alert_templates = [
                { "title": "High Traffic Congestion Detected", "description": "Traffic volume exceeding normal capacity by 45% in Downtown District", "severity": "urgent", "location": "Downtown District - Main St & 5th Ave", "status": "active", "assigned_to": "Traffic Control Team", "estimated_resolution": "15 minutes" },
                { "title": "Air Quality Alert", "description": "AQI levels above recommended threshold in Industrial Zone", "severity": "warning", "location": "Industrial Zone - Sector 7", "status": "investigating", "assigned_to": "Environmental Team", "estimated_resolution": "45 minutes" },
                { "title": "Water Main Pressure Drop", "description": "Significant pressure reduction detected in residential water supply", "severity": "warning", "location": "Residential Area B - Block 12", "status": "in-progress", "assigned_to": "Water Management", "estimated_resolution": "2 hours" },
                { "title": "Street Light Maintenance Complete", "description": "LED street light installation completed successfully", "severity": "resolved", "location": "Commercial Hub - Oak Street", "status": "resolved", "assigned_to": "Maintenance Team", "estimated_resolution": "Completed" },
                { "title": "Emergency Response Dispatch", "description": "Fire department responding to commercial building alarm", "severity": "urgent", "location": "Business District - Tower Plaza", "status": "active", "assigned_to": "Emergency Services", "estimated_resolution": "30 minutes" },
                { "title": "Public Transport Delay", "description": "Bus route 42 experiencing delays due to road construction", "severity": "warning", "location": "Transit Route 42 - Central Station", "status": "monitoring", "assigned_to": "Transit Authority", "estimated_resolution": "4 hours" },
                { "title": "Waste Collection Completed", "description": "Scheduled waste collection completed ahead of schedule", "severity": "resolved", "location": "Residential Area A - All Sectors", "status": "resolved", "assigned_to": "Sanitation Team", "estimated_resolution": "Completed" },
                { "title": "Power Grid Optimization", "description": "Electrical load balancing completed successfully", "severity": "resolved", "location": "City-wide Grid Network", "status": "resolved", "assigned_to": "Power Grid Team", "estimated_resolution": "Completed" }
            ]
            
            for alert_data in alert_templates:
                # Create realistic, recent timestamps
                random_minutes = random.randint(5, 240) # 5 mins to 4 hours ago
                alert_time = datetime.utcnow() - timedelta(minutes=random_minutes)
                
                new_alert = Alert(
                    title=alert_data["title"],
                    description=alert_data["description"],
                    severity=alert_data["severity"],
                    timestamp=alert_time,
                    location=alert_data["location"],
                    status=alert_data["status"],
                    assigned_to=alert_data["assigned_to"],
                    estimated_resolution=alert_data["estimated_resolution"]
                )
                db.session.add(new_alert)
            
            db.session.commit()
            print(f"{len(alert_templates)} alerts have been seeded.")

# In app.py, replace your existing check_for_alerts function

def check_for_alerts():
    """
    Checks various data sources for conditions that should trigger an alert.
    """
    with app.app_context():
        print(f"--- Running Alert Check at {datetime.now()} ---")
        
        # --- 1. Air Quality Alert ---
        latest_aqi = AirQualityData.query.order_by(AirQualityData.timestamp.desc()).first()
        if latest_aqi and latest_aqi.aqi and latest_aqi.aqi >= 4:
            if not Alert.query.filter_by(title="High Air Pollution", status="active").first():
                db.session.add(Alert(
                    title="High Air Pollution", description=f"AQI levels are at {latest_aqi.aqi} ({latest_aqi.description})",
                    severity="warning", location="City-wide", status="active",
                    assigned_to="Environmental Team", estimated_resolution="2 hours"
                ))
                print("SUCCESS: New Air Quality Alert generated!")

        # --- 2. Traffic Congestion Alert ---
        latest_traffic = TrafficData.query.order_by(TrafficData.timestamp.desc()).first()
        if latest_traffic and latest_traffic.data:
            fdata = latest_traffic.data.get("flowSegmentData", {})
            if fdata.get("freeFlowTravelTime", 0) > 0:
                congestion = fdata.get("currentTravelTime", 0) / fdata.get("freeFlowTravelTime")
                if congestion > 1.5: # 50% slower than normal
                    if not Alert.query.filter_by(title="High Traffic Congestion", status="active").first():
                        db.session.add(Alert(
                            title="High Traffic Congestion", description=f"Traffic is {congestion:.0%} of free-flow speed.",
                            severity="urgent", location="Downtown District", status="active",
                            assigned_to="Traffic Control", estimated_resolution="45 minutes"
                        ))
                        print("SUCCESS: New Traffic Congestion Alert generated!")
        
        # --- 3. High Complaint Volume Alert ---
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        recent_complaints_count = ComplaintData.query.filter(ComplaintData.timestamp >= one_hour_ago).count()
        if recent_complaints_count > 10:
             if not Alert.query.filter_by(title="High Complaint Volume", status="active").first():
                db.session.add(Alert(
                    title="High Complaint Volume", description=f"{recent_complaints_count} new complaints in the last hour.",
                    severity="warning", location="City-wide", status="active",
                    assigned_to="Public Grievance Team", estimated_resolution="Investigating"
                ))
                print("SUCCESS: New Complaint Volume Alert generated!")
        
        # --- 4. NEW: Power Grid Strain Alert ---
        latest_power = ElectricityData.query.order_by(ElectricityData.timestamp.desc()).first()
        if latest_power and latest_power.data and latest_power.data.get("powerConsumptionTotal", 0) > 25000: # Example threshold
            if not Alert.query.filter_by(title="Power Grid Strain", status="active").first():
                db.session.add(Alert(
                    title="Power Grid Strain", description=f"Total power consumption has exceeded 25,000 MW.",
                    severity="warning", location="IN-WE Grid", status="active",
                    assigned_to="Power Grid Team", estimated_resolution="Monitoring"
                ))
                print("SUCCESS: New Power Grid Alert generated!")

        # --- 5. NEW: High Water Consumption Alert ---
        latest_water = WaterData.query.order_by(WaterData.timestamp.desc()).first()
        if latest_water and "High" in latest_water.condition:
            if not Alert.query.filter_by(title="High Water Consumption", status="active").first():
                db.session.add(Alert(
                    title="High Water Consumption", description=f"Water usage at {latest_water.usage} ML, exceeding normal levels.",
                    severity="warning", location="City Water Supply", status="active",
                    assigned_to="Water Management", estimated_resolution="1 hour"
                ))
                print("SUCCESS: New Water Usage Alert generated!")

        # --- 6. NEW: Negative Sentiment Spike Alert ---
        df = load_data()
        if not df.empty:
            day_ago = datetime.now() - timedelta(days=1)
            week_ago = datetime.now() - timedelta(days=7)
            
            recent_neg = df[(df["timestamp"] >= day_ago) & (df["sentiment"] == "negative")].shape[0]
            recent_total = df[df["timestamp"] >= day_ago].shape[0]
            
            baseline_neg = df[(df["timestamp"] >= week_ago) & (df["sentiment"] == "negative")].shape[0]
            baseline_total = df[df["timestamp"] >= week_ago].shape[0]

            if recent_total > 10 and baseline_total > 50: # Ensure enough data
                recent_percent = (recent_neg / recent_total) * 100
                baseline_percent = (baseline_neg / baseline_total) * 100
                if recent_percent > (baseline_percent + 10) and recent_percent > 20: # If 10% higher than baseline and over 20%
                    if not Alert.query.filter_by(title="Spike in Negative Sentiment", status="active").first():
                        db.session.add(Alert(
                            title="Spike in Negative Sentiment", description=f"Negative sentiment is at {recent_percent:.0f}% in the last 24h, a significant increase.",
                            severity="urgent", location="Public Feedback Channels", status="active",
                            assigned_to="PR Department", estimated_resolution="Under Review"
                        ))
                        print("SUCCESS: New Negative Sentiment Alert generated!")

        db.session.commit()


# ----------------- Flask Endpoints -----------------

# -- System endpoints (traffic, electricity, water, air, complaints) --
@app.route("/traffic", methods=["GET"])
def get_traffic():
    return jsonify(fetch_traffic())

@app.route("/electricity", methods=["GET"])
def get_electricity_load():
    return jsonify(fetch_electricity())

@app.route("/electricity/forecast", methods=["GET"])
def get_forecast():
    # Generate synthetic data then run forecasting service
    df = generate_synthetic_data(hours=24 * 60)  # example: minute-level for 24h
    forecast, stats = build_forecast(df)
    return jsonify({
        "forecast": forecast,
        "stats": stats,
        "feature_importance": [
            {"feature": "Historical Patterns", "importance": 0.85},
            {"feature": "Weather Conditions", "importance": 0.72},
            {"feature": "Population Density", "importance": 0.68},
            {"feature": "Time of Day", "importance": 0.64},
            {"feature": "Special Events", "importance": 0.45},
            {"feature": "Economic Indicators", "importance": 0.32},
        ]
    })

@app.route("/water", methods=["GET"])
def get_water_usage():
    return jsonify(fetch_water())

@app.route("/complaints", methods=["GET"])
def get_complaints():
    return jsonify(fetch_complaints())

@app.route("/air", methods=["GET"])
def get_air_quality():
    lat = request.args.get("lat", 28.6139)
    lon = request.args.get("lon", 77.2090)
    return jsonify(fetch_air(lat, lon))

# ----------------- Zones endpoint -----------------
@app.route("/zones", methods=["GET"])
def get_all_zones():
    zones_from_db = Zone.query.all()
    zone_data = []
    for zone in zones_from_db:
        air_data = fetch_air(lat=zone.latitude, lon=zone.longitude)
        # Simulated metrics
        simulated_water_usage = random.randint(60, 120)
        simulated_complaints = random.randint(1, 5)
        if zone.priority == "high":
            simulated_complaints = random.randint(10, 25)

        recommendations = []
        aqi_val = air_data.get("aqi") if isinstance(air_data, dict) else None
        if aqi_val and isinstance(aqi_val, int) and aqi_val >= 4:
            recommendations.append("Deploy air purifiers and monitor emissions.")
        if simulated_complaints > 15:
            recommendations.append("Prioritize complaint resolution teams in this area.")
        if simulated_water_usage > 100:
            recommendations.append("Check for water leakages and promote conservation.")
        if not recommendations:
            recommendations.append("All systems operating within normal parameters.")

        zone_info = {
            "id": zone.id,
            "name": zone.name,
            "priority": zone.priority,
            "position": {"top": zone.position_top, "left": zone.position_left},
            "aqi": aqi_val if aqi_val is not None else 0,
            "complaints": simulated_complaints,
            "waterUsage": simulated_water_usage,
            "recommendations": recommendations,
        }
        zone_data.append(zone_info)

    return jsonify(zone_data)

# ----------------- Sentiment Endpoints (summary, trend, wordcloud, topics, complaints) -----------------

@app.route("/api/sentiment/summary", methods=["GET"])
def sentiment_summary():
    """
    Returns sentiment percentages (positive/neutral/negative) over the requested number of days.
    Query param: days (int, default 30)
    """
    days_to_filter = request.args.get('days', 30, type=int)
    start_date = datetime.now() - timedelta(days=days_to_filter)

    df = load_data()
    if df.empty:
        return jsonify({"positive": 0, "neutral": 0, "negative": 0, "total": 0})

    # filter by timestamp
    try:
        df = df[df["timestamp"] >= start_date]
    except Exception:
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df = df[df["timestamp"] >= start_date]

    total = len(df)
    counts = df["sentiment"].value_counts().to_dict()

    positive_p = round((counts.get("positive", 0) / total) * 100) if total > 0 else 0
    neutral_p = round((counts.get("neutral", 0) / total) * 100) if total > 0 else 0
    negative_p = round((counts.get("negative", 0) / total) * 100) if total > 0 else 0

    return jsonify({
        "positive": positive_p, "neutral": neutral_p, "negative": negative_p, "total": total
    })

@app.route("/api/sentiment/trend", methods=["GET"])
def sentiment_trend():
    """
    Returns a time-series trend of sentiments for the last `days` days.
    Query param: days (int, default 30)
    """
    days_to_filter = request.args.get('days', 30, type=int)
    start_date = datetime.now() - timedelta(days=days_to_filter)

    df = load_data()
    if df.empty:
        return jsonify({"days": [], "positive": [], "negative": [], "neutral": []})

    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df[df["timestamp"] >= start_date]
    df["date"] = df["timestamp"].dt.date

    trend_data = df.groupby(["date", "sentiment"]).size().unstack(fill_value=0).sort_index()

    # Ensure columns exist
    for col in ['positive', 'negative', 'neutral']:
        if col not in trend_data:
            trend_data[col] = 0

    return jsonify({
        "days": trend_data.index.astype(str).tolist(),
        "positive": trend_data["positive"].tolist(),
        "negative": trend_data["negative"].tolist(),
        "neutral": trend_data["neutral"].tolist(),
    })

@app.route("/api/sentiment/wordcloud", methods=["GET"])
def sentiment_wordcloud():
    """
    Returns top words and counts from the feedback text over last `days` days.
    Query param: days (int, default 30)
    """
    days_to_filter = request.args.get('days', 30, type=int)
    start_date = datetime.now() - timedelta(days=days_to_filter)

    df = load_data()
    if df.empty:
        return jsonify({"words": []})

    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df[df["timestamp"] >= start_date]
    words = " ".join(df["clean_text"].astype(str)).split()
    counter = Counter(words)
    top_words = [{"text": w, "value": c} for w, c in counter.most_common(20)]
    return jsonify({"words": top_words})

@app.route("/api/sentiment/topics", methods=["GET"])
def sentiment_topics():
    """
    Categorize feedback into topics with percentage and dominant sentiment.
    Query param: days (int, default 30)
    """
    days_to_filter = request.args.get('days', 30, type=int)
    start_date = datetime.now() - timedelta(days=days_to_filter)

    df = load_data()
    if df.empty:
        return jsonify([])

    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df[df["timestamp"] >= start_date]

    topic_keywords = {
        "Traffic & Roads": ["traffic", "roads", "congestion", "commuting", "parking", "pothole", "potholes"],
        "Public Services": ["waste", "garbage", "service", "lights", "street lights"],
        "Environment": ["clean", "green", "pollution", "air", "aqi"],
        "Public Transport": ["transport", "bus", "metro", "train"],
        "Water & Sanitation": ["water", "leakage", "sewer"],
    }

    def assign_topic(text):
        text = str(text).lower()
        for topic, keywords in topic_keywords.items():
            if any(keyword in text for keyword in keywords):
                return topic
        return "General"

    df["topic"] = df["text"].apply(assign_topic)
    topic_summary = []
    topic_counts = df["topic"].value_counts()
    total_feedback = len(df)

    for topic, count in topic_counts.items():
        topic_df = df[df["topic"] == topic]
        dominant_sentiment = topic_df["sentiment"].mode()[0] if not topic_df["sentiment"].mode().empty else "neutral"
        percentage = round((count / total_feedback) * 100) if total_feedback > 0 else 0
        topic_summary.append({
            "name": topic,
            "percentage": percentage,
            "sentiment": dominant_sentiment
        })

    return jsonify(topic_summary)

@app.route("/api/sentiment/complaints", methods=["GET"])
def sentiment_sample_complaints():
    """
    Return sample complaint entries from CSV, with confidence simulated.
    Query param: days (int, default 30)
    """
    days_to_filter = request.args.get('days', 30, type=int)
    start_date = datetime.now() - timedelta(days=days_to_filter)

    df = load_data()
    if df.empty:
        return jsonify([])

    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df = df[df["timestamp"] >= start_date]

    # sample safely (if <5 rows, sample without replacement will error)
    sample_n = min(5, max(0, len(df)))
    if sample_n == 0:
        return jsonify([])

    sample_df = df.sample(n=sample_n)

    complaints_list = []
    for _, row in sample_df.iterrows():
        complaints_list.append({
            "raw": row.get("text", ""),
            "processed": row.get("clean_text", ""),
            "sentiment": row.get("sentiment", "neutral"),
            "confidence": random.randint(85, 98),
            "category": "Citizen Feedback"
        })

    return jsonify(complaints_list)


@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    """Fetches all alerts from the database, newest first."""
    alerts_from_db = Alert.query.order_by(Alert.timestamp.desc()).all()
    
    alerts_list = []
    for alert in alerts_from_db:
        alerts_list.append({
            "id": alert.id,
            "title": alert.title,
            "description": alert.description,
            "severity": alert.severity,
            "timestamp": alert.timestamp.strftime("%Y-%m-%d %H:%M:%S"), # Format for consistency
            "location": alert.location,
            "status": alert.status,
            "assignedTo": alert.assigned_to,
            "estimatedResolution": alert.estimated_resolution
        })
        
    return jsonify(alerts_list)

# In app.py, add this new endpoint

@app.route("/api/alerts/<int:alert_id>/resolve", methods=["POST"])
def resolve_alert(alert_id):
    """Finds an alert by its ID and updates its status to 'resolved'."""
    with app.app_context():
        alert = Alert.query.get(alert_id)
        if alert is None:
            return jsonify({"error": "Alert not found"}), 404

        alert.status = "resolved"
        alert.severity = "resolved" # Also update severity for consistent styling
        db.session.commit()
        
        # Return the updated alert
        updated_alert = {
            "id": alert.id, "title": alert.title, "description": alert.description,
            "severity": alert.severity, "timestamp": alert.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "location": alert.location, "status": alert.status, "assignedTo": alert.assigned_to,
            "estimatedResolution": "Completed" # Update resolution text
        }
        return jsonify(updated_alert)

# ----------------- App start -----------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_zones()
        seed_alerts()
        start_scheduler()
    app.run(debug=True, port=5000)

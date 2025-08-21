from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import random
from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler

# Import db + models
from src.model.models import db, TrafficData, ElectricityData, WaterData, ComplaintData, AirQualityData

# ----------------- Init Flask -----------------
app = Flask(__name__)
CORS(app)

# ----------------- DB Config -----------------
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///citypulse.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# ----------------- API Keys -----------------
TRAFFIC_API_KEY = "VI9jSE9x52n9l3utfHd56fBFwUMBTP67"
ELECTRICITY_API_KEY = "YN2HzxHNkOf1vuRNQRuU"
ELECTRICITY_URL = "https://api.electricitymaps.com/v3/power-breakdown/latest"
OWM_KEY = "819ffa329997898cd067b2db0bea3fef"

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

# ----------------- Helper functions -----------------
def fetch_traffic():
    lat, lon = 28.6139, 77.2090  # New Delhi
    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?key={TRAFFIC_API_KEY}&point={lat},{lon}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        congestion = data["flowSegmentData"]["currentTravelTime"] / data["flowSegmentData"]["freeFlowTravelTime"]
        congestion_percent = round(congestion * 100, 2)

        traffic_entry = TrafficData(data=data)
        db.session.add(traffic_entry)
        db.session.commit()

        return {"congestion": f"{congestion_percent}%"}
    return None


def fetch_electricity():
    zone = "IN-WE"
    headers = {"auth-token": ELECTRICITY_API_KEY}
    r = requests.get(f"{ELECTRICITY_URL}?zone={zone}", headers=headers)
    if r.status_code == 200:
        data = r.json()
        total_load = data["powerConsumptionTotal"]

        electricity_entry = ElectricityData(data=data)
        db.session.add(electricity_entry)
        db.session.commit()

        return {"zone": zone, "electricity_load": f"{total_load} MW"}
    return None


def fetch_air(lat=28.6139, lon=77.2090):
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OWM_KEY}"
    r = requests.get(url)
    if r.status_code == 200:
        data = r.json()
        aqi = data["list"][0]["main"]["aqi"]
        aqi_labels = {1: "Good 🌿", 2: "Fair 🙂", 3: "Moderate 😐", 4: "Poor 😷", 5: "Very Poor ☠️"}

        air_entry = AirQualityData(aqi=aqi, description=aqi_labels.get(aqi, "Unknown"))
        db.session.add(air_entry)
        db.session.commit()

        return {"aqi": aqi, "description": aqi_labels.get(aqi, "Unknown")}
    return None


def fetch_water():
    usage = round(random.uniform(2.0, 3.0), 2)
    status = "Normal range"
    if usage > 2.8:
        status = "High ⚠️"
    elif usage < 2.2:
        status = "Low 💧"

    water_entry = WaterData(usage=usage, condition=status)
    db.session.add(water_entry)
    db.session.commit()

    return {"water_usage": f"{usage} ML", "condition": status}


def fetch_complaints():
    complaints = []
    for i in range(5):  # save 5 at a time
        category = random.choice(CATEGORIES)
        description = random.choice(SAMPLE_COMPLAINTS)
        status = random.choice(["Open", "In Progress", "Resolved"])

        complaint_entry = ComplaintData(
            category=category,
            description=description,
            status=status
        )
        db.session.add(complaint_entry)
        complaints.append({
            "category": category,
            "description": description,
            "status": status,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    db.session.commit()
    return {"count": len(complaints), "complaints": complaints}


# ----------------- Flask Endpoints -----------------
@app.route("/traffic", methods=["GET"])
def get_traffic():
    return jsonify(fetch_traffic())


@app.route("/electricity", methods=["GET"])
def get_electricity_load():
    return jsonify(fetch_electricity())


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


# ----------------- Scheduler -----------------
def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=fetch_traffic, trigger="interval", minutes=5)
    scheduler.add_job(func=fetch_electricity, trigger="interval", minutes=5)
    scheduler.add_job(func=fetch_air, trigger="interval", minutes=10)
    scheduler.add_job(func=fetch_water, trigger="interval", minutes=3)
    scheduler.add_job(func=fetch_complaints, trigger="interval", minutes=7)
    scheduler.start()


# ----------------- Run App -----------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        start_scheduler()
    app.run(debug=True, port=5000)

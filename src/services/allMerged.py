from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ----------------- 🚗 Traffic API -----------------
TRAFFIC_API_KEY = "VI9jSE9x52n9l3utfHd56fBFwUMBTP67"

@app.route("/traffic", methods=["GET"])
def get_traffic():
    lat, lon = 28.6139, 77.2090  # New Delhi
    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?key={TRAFFIC_API_KEY}&point={lat},{lon}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        congestion = data["flowSegmentData"]["currentTravelTime"] / data["flowSegmentData"]["freeFlowTravelTime"]
        congestion_percent = round(congestion * 100, 2)
        return jsonify({"status": "success", "congestion": f"{congestion_percent}%"})
    else:
        return jsonify({"status": "error", "code": response.status_code, "message": response.text}), response.status_code


# ----------------- ⚡ Electricity API -----------------
ELECTRICITY_API_KEY = "YN2HzxHNkOf1vuRNQRuU"
ELECTRICITY_URL = "https://api.electricitymaps.com/v3/power-breakdown/latest"

@app.route("/electricity", methods=["GET"])
def get_electricity_load():
    zone = "IN-WE"  # Western India
    headers = {"auth-token": ELECTRICITY_API_KEY}
    url = f"{ELECTRICITY_URL}?zone={zone}"
    r = requests.get(url, headers=headers)

    if r.status_code == 200:
        data = r.json()
        total_load = data["powerConsumptionTotal"]
        return jsonify({
            "status": "success",
            "zone": zone,
            "electricity_load": f"{total_load} MW",
            "breakdown": data["powerConsumptionBreakdown"]
        })
    else:
        return jsonify({"status": "error", "code": r.status_code, "msg": r.text}), r.status_code


# ----------------- 🌊 Water API (Simulated) -----------------
@app.route("/water", methods=["GET"])
def get_water_usage():
    usage = round(random.uniform(2.0, 3.0), 2)
    status = "Normal range"
    if usage > 2.8:
        status = "High ⚠️"
    elif usage < 2.2:
        status = "Low 💧"

    return jsonify({
        "status": "success",
        "water_usage": f"{usage} ML",
        "condition": status
    })


# ----------------- 📢 Complaints API (Simulated) -----------------
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

@app.route("/complaints", methods=["GET"])
def get_complaints():
    complaints = []
    for i in range(890):
        complaints.append({
            "id": i + 1,
            "category": random.choice(CATEGORIES),
            "description": random.choice(SAMPLE_COMPLAINTS),
            "status": random.choice(["Open", "In Progress", "Resolved"]),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify({"status": "success", "count": len(complaints), "complaints": complaints})


# ----------------- 🌬️ Air Quality API -----------------
OWM_KEY = "819ffa329997898cd067b2db0bea3fef"

@app.route("/air", methods=["GET"])
def get_air_quality():
    lat = request.args.get("lat", 28.6139)
    lon = request.args.get("lon", 77.2090)
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OWM_KEY}"
    r = requests.get(url)

    if r.status_code == 200:
        data = r.json()
        aqi = data["list"][0]["main"]["aqi"]
        aqi_labels = {1: "Good 🌿", 2: "Fair 🙂", 3: "Moderate 😐", 4: "Poor 😷", 5: "Very Poor ☠️"}
        return jsonify({"status": "success", "aqi": aqi, "description": aqi_labels.get(aqi, "Unknown")})
    else:
        return jsonify({"status": "error", "code": r.status_code, "msg": r.text}), r.status_code


# ----------------- Run App -----------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)

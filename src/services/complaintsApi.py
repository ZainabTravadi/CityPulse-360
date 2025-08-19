"""
📢 Complaints API (Simulated 311 System)

Note:
Many cities (like in the US) have official 311 complaint systems, 
but there is no global free API for city-wide complaints. 

To showcase how CityPulse 360° could integrate public complaint 
data, this endpoint simulates complaints (roads, electricity, 
garbage, etc.) with random categories, statuses, and timestamps. 

This acts as a placeholder for real 311/Open311 APIs or city 
government datasets that can be integrated later.
"""

from flask import Flask, jsonify
import random
from datetime import datetime

app = Flask(__name__)

# Sample categories & complaints
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
    for i in range(5):  # simulate 5 active complaints
        complaints.append({
            "id": i + 1,
            "category": random.choice(CATEGORIES),
            "description": random.choice(SAMPLE_COMPLAINTS),
            "status": random.choice(["Open", "In Progress", "Resolved"]),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })

    return jsonify({
        "status": "success",
        "count": len(complaints),
        "complaints": complaints
    })

if __name__ == "__main__":
    app.run(debug=True, port=5004)

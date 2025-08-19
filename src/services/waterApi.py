"""
🌊 Water Usage API (Simulated)

Note:
There is no publicly available real-time water consumption API 
for city-level usage. To demonstrate functionality within the 
CityPulse 360° project, this endpoint simulates realistic water 
usage data (in million liters, ML). 

This simulation ensures the backend architecture remains intact 
and can easily be swapped with a real API in the future if one 
becomes available.
"""

from flask import Flask, jsonify
import random

app = Flask(__name__)

@app.route("/water", methods=["GET"])
def get_water_usage():
    # Simulate water usage in ML (Mega Liters)
    usage = round(random.uniform(2.0, 3.0), 2)  # e.g., 2.4ML
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

if __name__ == "__main__":
    app.run(debug=True, port=5002)

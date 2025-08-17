from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

# Your OpenWeather API key
OWM_KEY = "819ffa329997898cd067b2db0bea3fef"

@app.route("/air", methods=["GET"])
def get_air_quality():
    # Default to New Delhi if no coordinates provided
    lat = request.args.get("lat", 28.6139)
    lon = request.args.get("lon", 77.2090)

    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={OWM_KEY}"
    r = requests.get(url)

    if r.status_code == 200:
        data = r.json()
        aqi = data["list"][0]["main"]["aqi"]

        # AQI scale (1=Good, 5=Very Poor)
        aqi_labels = {
            1: "Good 🌿",
            2: "Fair 🙂",
            3: "Moderate 😐",
            4: "Poor 😷",
            5: "Very Poor ☠️"
        }

        return jsonify({
            "status": "success",
            "aqi": aqi,
            "description": aqi_labels.get(aqi, "Unknown")
        })
    else:
        return jsonify({
            "status": "error",
            "code": r.status_code,
            "msg": r.text
        }), r.status_code


if __name__ == "__main__":
    app.run(debug=True, port=5001)  # run on different port to avoid clash

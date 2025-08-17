from flask import Flask, jsonify
import requests

app = Flask(__name__)

# Your API key
api_key = "VI9jSE9x52n9l3utfHd56fBFwUMBTP67"

@app.route("/traffic", methods=["GET"])
def get_traffic():
    # Example: New Delhi coordinates
    lat, lon = 28.6139, 77.2090

    url = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?key={api_key}&point={lat},{lon}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        congestion = (
            data["flowSegmentData"]["currentTravelTime"] /
            data["flowSegmentData"]["freeFlowTravelTime"]
        )
        congestion_percent = round(congestion * 100, 2)

        return jsonify({
            "status": "success",
            "congestion": f"{congestion_percent}%"
        })
    else:
        return jsonify({
            "status": "error",
            "code": response.status_code,
            "message": response.text
        }), response.status_code

if __name__ == "__main__":
    app.run(debug=True, port=5000)

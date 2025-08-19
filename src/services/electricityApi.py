from flask import Flask, jsonify
import requests

app = Flask(__name__)

API_KEY = "YN2HzxHNkOf1vuRNQRuU"
BASE_URL = "https://api.electricitymaps.com/v3/power-breakdown/latest"

@app.route("/electricity", methods=["GET"])
def get_electricity_load():
    zone = "IN-WE"  # Western India
    headers = {"auth-token": API_KEY}
    url = f"{BASE_URL}?zone={zone}"

    r = requests.get(url, headers=headers)

    if r.status_code == 200:
        data = r.json()
        total_load = data["powerConsumptionTotal"]  # in MW

        return jsonify({
            "status": "success",
            "zone": zone,
            "electricity_load": f"{total_load} MW",
            "breakdown": data["powerConsumptionBreakdown"]
        })
    else:
        return jsonify({
            "status": "error",
            "code": r.status_code,
            "msg": r.text
        }), r.status_code

if __name__ == "__main__":
    app.run(debug=True, port=5003)

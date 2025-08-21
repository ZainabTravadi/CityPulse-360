from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# 🚗 Traffic
class TrafficData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    data = db.Column(db.JSON)  # store full API JSON


# ⚡ Electricity
class ElectricityData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    data = db.Column(db.JSON)  # store full API JSON


# 🌊 Water (simulated)
class WaterData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    usage = db.Column(db.Float)       # e.g. 2.5 ML
    condition = db.Column(db.String(50))  # e.g. "High ⚠️", "Normal", "Low 💧"


# 📢 Complaints (simulated)
class ComplaintData(db.Model):   # ⚠️ renamed to match allMerged.py
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(100))
    description = db.Column(db.String(255))
    status = db.Column(db.String(50))   # e.g. "Open", "In Progress", "Resolved"


# 🌬️ Air Quality
class AirQualityData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    aqi = db.Column(db.Integer)  # 1–5 scale
    description = db.Column(db.String(50))  # "Good 🌿", "Poor 😷", etc.

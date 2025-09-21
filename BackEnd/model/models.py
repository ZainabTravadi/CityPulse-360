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
class ComplaintData(db.Model):   
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

# In src/model/models.py

class Zone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(50), nullable=False)
    
    # Store position and coordinates for easy retrieval
    position_top = db.Column(db.String(10)) # e.g., "35%"
    position_left = db.Column(db.String(10)) # e.g., "45%"
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Zone {self.name}>'
    
class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500))
    severity = db.Column(db.String(50), nullable=False) # e.g., 'urgent', 'warning', 'resolved'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    location = db.Column(db.String(200))
    status = db.Column(db.String(50)) # e.g., 'active', 'investigating', 'resolved'
    assigned_to = db.Column(db.String(100))
    estimated_resolution = db.Column(db.String(100))

    def __repr__(self):
        return f'<Alert {self.title}>'
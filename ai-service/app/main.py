from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os


app = FastAPI(title="DriveMind AI Service")

MODEL_PATH = "models/intent_model.joblib"

model = None

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)


class IntentRequest(BaseModel):
    speed: float
    acceleration: float
    brakePressure: float
    steeringAngle: float
    laneOffset: float
    distanceToFrontVehicle: float


@app.get("/")
def root():
    return {
        "message": "DriveMind AI service is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "DriveMind AI Service",
        "modelLoaded": model is not None
    }


@app.post("/predict-intent")
def predict_intent(data: IntentRequest):
    if model is None:
        return {
            "success": False,
            "message": "Intent model not found. Train the model first."
        }

    features = [[
        data.speed,
        data.acceleration,
        data.brakePressure,
        data.steeringAngle,
        data.laneOffset,
        data.distanceToFrontVehicle
    ]]

    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    confidence = float(max(probabilities))

    return {
        "success": True,
        "predictedIntent": prediction,
        "confidence": round(confidence, 2)
    }
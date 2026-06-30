# DriveMind System Logic

## 1. Project Purpose

DriveMind is a collective vehicle intelligence system.

The goal is not only to let vehicles share data, but to let vehicles share useful driving experience.

Instead of sending raw video or sensor streams, a vehicle sends a compressed knowledge packet such as:

> Curve-42 has high near-miss probability during rain because visibility is low.

---

## 2. Main Users

### 2.1 Vehicle Agent

A simulated or real vehicle that sends telemetry data.

It provides:

- speed
- acceleration
- brake pressure
- steering angle
- lane position
- road segment
- weather condition
- distance to front vehicle

### 2.2 AI Service

The AI service predicts vehicle intent.

It predicts whether the vehicle is likely to:

- brake
- accelerate
- turn left
- turn right
- change lane
- continue normally

### 2.3 Memory Service

The memory service stores driving experiences.

It stores:

- near-miss events
- sudden braking events
- risky road conditions
- weather-specific hazards
- recommended safety actions

### 2.4 Dashboard User

The dashboard user is an admin, developer, or traffic analyst.

They can see:

- live vehicles
- risky road segments
- AI predictions
- collective memory events
- graph relationships

---

## 3. Main System Flow

### Step 1: Vehicle Sends Telemetry

A vehicle continuously sends current driving data to the backend.

Example:

```json
{
  "vehicleId": "vehicle_01",
  "roadSegmentId": "curve_42",
  "speed": 62,
  "acceleration": -1.2,
  "brakePressure": 0.74,
  "steeringAngle": 18,
  "laneOffset": 0.35,
  "distanceToFrontVehicle": 9,
  "weather": "rain"
}
```

### Step 2: Backend Checks Past Road Experience

The backend checks whether this road segment has previous risky events.

Example question:

> Have vehicles experienced near misses at Curve-42 during rain before?

If past risky events exist, the backend increases the road risk score.

---

### Step 3: AI Predicts Vehicle Intent

The backend sends vehicle telemetry data to the AI service.

The AI service checks features like:

- speed
- acceleration
- brake pressure
- steering angle
- lane offset
- distance to front vehicle

Then it predicts the vehicle's future action.

Example AI output:

```json
{
  "predictedIntent": "brake",
  "confidence": 0.87
}
```

---

### Step 4: Risk Score Is Calculated

The backend calculates road risk using:

- previous near-miss frequency
- weather severity
- road curvature
- vehicle speed
- predicted intent risk

Example risk formula:

```text
Risk Score =
0.35 × near_miss_frequency
+ 0.25 × weather_severity
+ 0.20 × road_curvature
+ 0.10 × vehicle_speed_risk
+ 0.10 × intent_risk
```

Risk levels:

```text
0.00 - 0.30 = Low Risk
0.31 - 0.60 = Medium Risk
0.61 - 0.80 = High Risk
0.81 - 1.00 = Critical Risk
```

---

### Step 5: Alert Is Generated

If the risk score is high, DriveMind sends an alert.

Example alert:

> High risk at Curve-42. Previous vehicles reported near misses during rain due to low visibility. Recommended action: reduce speed by 25%.

The alert is explainable because it tells:

- where the risk is
- why the risk exists
- what happened before
- what the vehicle should do next

---

### Step 6: Experience Is Stored

If a risky event happens, the backend stores it in MongoDB.

Example stored experience:

```json
{
  "vehicleId": "vehicle_01",
  "roadSegmentId": "curve_42",
  "weather": "rain",
  "event": "near_miss",
  "reason": "low_visibility",
  "recommendedAction": "reduce_speed_by_25_percent",
  "confidence": 0.89
}
```

---

### Step 7: Collective Memory Graph Is Updated

The same event is also added to Neo4j as a relationship graph.

Example graph structure:

```text
Vehicle_01
  -> EXPERIENCED
Near_Miss
  -> AT
Curve_42
  -> DURING
Rain
  -> CAUSED_BY
Low_Visibility
```

This creates a collective road intelligence network over time.

---

## 4. Why This Is Different

Normal connected vehicle systems share current data.

DriveMind shares learned experience.

Current systems answer:

> What is happening now?

DriveMind answers:

> What happened here before, why did it happen, and what should the next vehicle do?

---

## 5. MVP Scope

The first working version will include:

1. Backend API for vehicle telemetry
2. MongoDB storage for telemetry and experiences
3. AI service for intent prediction
4. Risk scoring logic
5. Neo4j graph memory
6. React dashboard
7. Real-time alerts using Socket.IO

---

## 6. Advanced Scope

The advanced resume-level version will include:

1. CARLA simulation
2. Model evaluation metrics
3. Confusion matrix
4. Explainable risk alerts
5. Graph-based road intelligence queries
6. Docker Compose setup
7. Clean GitHub documentation

---

## 7. Final Project Summary

DriveMind turns individual driving experiences into shared road intelligence.

Instead of every vehicle repeating the same mistake, each vehicle can benefit from what previous vehicles already learned.

The main innovation is:

> Vehicles share experience, not raw data.
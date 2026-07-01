# DriveMind Frontend Dashboard

## 1. Purpose

The DriveMind dashboard visualizes the current backend, AI, risk, and experience memory flow.

It allows a user to test the full system by sending risky vehicle telemetry from the frontend.

---

## 2. Frontend Stack

```text
React
Vite
Tailwind CSS
Axios
Socket.IO Client
```

---

## 3. Main Dashboard Sections

### Backend Health

Shows whether the Node.js backend is running.

Uses:

```http
GET /api/health
```

---

### Road Risk

Shows risk summary for:

```text
curve_42
```

Uses:

```http
GET /api/road-risk/curve_42
```

---

### Experience Count

Shows how many experience memories are currently stored.

Uses:

```http
GET /api/experiences
```

---

### Send Test Telemetry

Sends sample risky telemetry to the backend.

Uses:

```http
POST /api/telemetry
```

The backend then:

1. stores telemetry
2. calls AI service
3. predicts vehicle intent
4. calculates risk
5. creates experience memory
6. emits realtime alert

---

### Latest Realtime Risk Alert

Listens to Socket.IO event:

```text
risk-alert
```

Displays:

- road segment
- predicted intent
- risk level
- recommended action

---

### Experience Memory

Displays latest stored experience memories from MongoDB.

Each memory shows:

- vehicle ID
- event type
- road segment
- weather
- risk score
- confidence
- recommended action

---

## 4. Current End-to-End Flow

```text
Dashboard button clicked
        ↓
POST /api/telemetry
        ↓
Backend stores telemetry
        ↓
Backend calls AI service
        ↓
AI predicts intent
        ↓
Backend calculates risk
        ↓
Experience memory created
        ↓
Socket.IO emits risk-alert
        ↓
Dashboard displays realtime alert
```

---

## 5. Local Frontend URL

```text
http://localhost:5173
```

---

## 6. Services Required

To use the dashboard fully, these services must be running:

```text
AI Service: http://127.0.0.1:8000
Backend: http://localhost:5001
Frontend: http://localhost:5173
MongoDB: localhost:27017
```
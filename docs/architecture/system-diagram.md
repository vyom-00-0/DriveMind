# DriveMind System Diagram

## High-Level Architecture

```text
+--------------------+
| Vehicle Telemetry  |
| Simulator / Input  |
+---------+----------+
          |
          v
+--------------------+
| Backend API        |
| Node.js + Express  |
+----+----------+----+
     |          |
     |          v
     |   +------------------+
     |   | AI Service       |
     |   | FastAPI + ML     |
     |   | Intent Prediction|
     |   +------------------+
     |
     v
+--------------------+
| Risk Scoring       |
| Rule-Based Engine  |
+----+----------+----+
     |          |
     |          v
     |   +------------------+
     |   | MongoDB          |
     |   | Experience Store |
     |   +------------------+
     |
     v
+--------------------+
| Neo4j              |
| Graph Memory       |
+----+---------------+
     |
     v
+--------------------+
| Socket.IO Alerts   |
| Real-Time Events   |
+----+---------------+
     |
     v
+--------------------+
| React Dashboard    |
| Visualization      |
+--------------------+
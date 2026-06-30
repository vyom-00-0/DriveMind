const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      index: true
    },

    roadSegmentId: {
      type: String,
      required: true,
      index: true
    },

    speed: {
      type: Number,
      required: true
    },

    acceleration: {
      type: Number,
      required: true
    },

    brakePressure: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },

    steeringAngle: {
      type: Number,
      required: true
    },

    laneOffset: {
      type: Number,
      required: true
    },

    distanceToFrontVehicle: {
      type: Number,
      required: true
    },

    weather: {
      type: String,
      enum: ["clear", "rain", "fog", "snow", "storm", "unknown"],
      default: "unknown"
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Telemetry", telemetrySchema);
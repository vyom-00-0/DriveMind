const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    vehicleType: {
      type: String,
      enum: ["car", "truck", "bus", "bike", "emergency", "unknown"],
      default: "unknown"
    },

    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active"
    },

    lastKnownRoadSegment: {
      type: String,
      default: null
    },

    lastTelemetryAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
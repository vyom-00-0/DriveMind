const mongoose = require("mongoose");

const roadSegmentSchema = new mongoose.Schema(
  {
    roadSegmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true
    },

    location: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },

    roadType: {
      type: String,
      enum: ["straight", "curve", "intersection", "highway", "bridge", "unknown"],
      default: "unknown"
    },

    curvature: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },

    speedLimit: {
      type: Number,
      required: true
    },

    visibilityRisk: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("RoadSegment", roadSegmentSchema);
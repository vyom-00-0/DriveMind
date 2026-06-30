const Vehicle = require("../models/Vehicle");
const Telemetry = require("../models/Telemetry");

const createTelemetry = async (req, res) => {
  try {
    const {
      vehicleId,
      roadSegmentId,
      speed,
      acceleration,
      brakePressure,
      steeringAngle,
      laneOffset,
      distanceToFrontVehicle,
      weather
    } = req.body;

    if (!vehicleId || !roadSegmentId) {
      return res.status(400).json({
        success: false,
        message: "vehicleId and roadSegmentId are required"
      });
    }

    const telemetry = await Telemetry.create({
      vehicleId,
      roadSegmentId,
      speed,
      acceleration,
      brakePressure,
      steeringAngle,
      laneOffset,
      distanceToFrontVehicle,
      weather
    });

    await Vehicle.findOneAndUpdate(
      { vehicleId },
      {
        vehicleId,
        lastKnownRoadSegment: roadSegmentId,
        lastTelemetryAt: new Date(),
        status: "active"
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: "Telemetry stored successfully",
      data: telemetry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to store telemetry",
      error: error.message
    });
  }
};

module.exports = {
  createTelemetry
};
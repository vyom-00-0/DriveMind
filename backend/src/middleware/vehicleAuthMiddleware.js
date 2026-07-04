const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "drivemind_secret_jwt_key_999";
const VEHICLE_SECRET_TOKEN = process.env.VEHICLE_SECRET_TOKEN || "vehicle_secret_token_123";

const verifyVehicle = (req, res, next) => {
  const token = req.headers["x-vehicle-token"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No vehicle verification token provided"
    });
  }

  // Allow static token for backwards compatibility
  if (token === VEHICLE_SECRET_TOKEN) {
    req.vehicleId = "legacy_vehicle_sim";
    return next();
  }

  // Otherwise, verify as a dynamic vehicle JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === "vehicle" || decoded.vehicleId) {
      req.vehicleId = decoded.vehicleId;
      return next();
    }
    throw new Error("Invalid token scope");
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Invalid vehicle verification token",
      error: error.message
    });
  }
};

module.exports = verifyVehicle;

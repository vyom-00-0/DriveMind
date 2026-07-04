const express = require("express");
const { register, login, registerVehicle } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/vehicle", registerVehicle);

module.exports = router;

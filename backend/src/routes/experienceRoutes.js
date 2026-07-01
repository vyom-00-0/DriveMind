const express = require("express");
const {
  getAllExperiences,
  getExperiencesByRoadSegment
} = require("../controllers/experienceController");

const router = express.Router();

router.get("/", getAllExperiences);
router.get("/road/:roadSegmentId", getExperiencesByRoadSegment);

module.exports = router;
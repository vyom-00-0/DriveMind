const Experience = require("../models/Experience");

const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch experiences",
      error: error.message
    });
  }
};

const getExperiencesByRoadSegment = async (req, res) => {
  try {
    const { roadSegmentId } = req.params;

    const experiences = await Experience.find({ roadSegmentId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      roadSegmentId,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch road segment experiences",
      error: error.message
    });
  }
};

module.exports = {
  getAllExperiences,
  getExperiencesByRoadSegment
};
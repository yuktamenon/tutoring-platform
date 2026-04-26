const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middleware/authMiddleware");
const {
  getRecommendedTutors,
  getLearningPathRecommendations,
  createLearningPath
} = require("../controllers/recommendationController");

router.get("/tutors/:studentId", protect, allowRoles("student"), getRecommendedTutors);
router.get("/learning-path/:studentId", protect, allowRoles("student"), getLearningPathRecommendations);

router.post("/learning-path", protect, createLearningPath);
module.exports = router;
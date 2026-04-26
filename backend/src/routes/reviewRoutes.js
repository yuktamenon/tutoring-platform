const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middleware/authMiddleware");

const {
  createReview,
  getTutorReviews
} = require("../controllers/reviewController");

router.post("/", protect, allowRoles("student"), createReview);
router.get("/tutor/:tutorId", getTutorReviews);

module.exports = router;
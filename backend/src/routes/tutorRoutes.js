const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middleware/authMiddleware");

const {
  createTutorProfile,
  getTutorProfile,
  assignSubjectToTutor,
  getTutorSubjects,
  searchTutors
} = require("../controllers/tutorController");

router.post("/create-profile", protect, allowRoles("tutor"), createTutorProfile);
router.post("/assign-subject", protect, allowRoles("tutor"), assignSubjectToTutor);

router.get("/search", searchTutors);
router.get("/:tutorId/subjects", getTutorSubjects);
router.get("/:userId", getTutorProfile);


module.exports = router;
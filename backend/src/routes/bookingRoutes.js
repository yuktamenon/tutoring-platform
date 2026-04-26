const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middleware/authMiddleware");

const {
  requestBooking,
  getStudentBookings,
  getTutorBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking
} = require("../controllers/bookingController");

router.post("/request", protect, allowRoles("student"), requestBooking);

router.get("/student/:studentId", protect, getStudentBookings);
router.get("/tutor/:tutorId", protect, getTutorBookings);

router.patch("/:bookingId/accept", protect, allowRoles("tutor"), acceptBooking);
router.patch("/:bookingId/reject", protect, allowRoles("tutor"), rejectBooking);
router.patch("/:bookingId/cancel", protect, cancelBooking);
router.patch("/:bookingId/complete", protect, allowRoles("tutor"), completeBooking);
module.exports = router;
const express = require("express");
const router = express.Router();

const {
  createAvailabilitySlot,
  getTutorAvailability,
  deleteAvailabilitySlot
} = require("../controllers/availabilityController");

router.post("/", createAvailabilitySlot);
router.get("/:tutorId", getTutorAvailability);
router.delete("/:slotId", deleteAvailabilitySlot);

module.exports = router;
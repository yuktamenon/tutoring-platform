const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getMessagesByBooking
} = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/booking/:bookingId", protect, getMessagesByBooking);

module.exports = router;
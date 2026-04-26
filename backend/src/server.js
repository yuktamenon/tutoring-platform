const express = require("express");

const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const messageRoutes = require("./routes/messageRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully" });
});

// Auth routes
app.use("/auth", authRoutes);
app.use("/subjects", subjectRoutes);
app.use("/tutors", tutorRoutes);
app.use("/availability", availabilityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/messages", messageRoutes);
app.use("/reviews", reviewRoutes);
app.use("/recommendations", recommendationRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
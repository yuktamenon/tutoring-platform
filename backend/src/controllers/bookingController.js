const prisma = require("../prisma");

// REQUEST BOOKING
const requestBooking = async (req, res) => {
  try {
    const {
      tutorId,
      subjectId,
      bookingDate,
      startTime,
      endTime,
      requestMessage
    } = req.body || {};

    const studentId = req.user.userId;

    if (!studentId || !tutorId || !subjectId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({
        message: "studentId, tutorId, subjectId, bookingDate, startTime, and endTime are required"
      });
    }

    const student = await prisma.user.findUnique({
      where: { id: Number(studentId) }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.role !== "student") {
      return res.status(400).json({ message: "Only students can request bookings" });
    }

    const tutor = await prisma.user.findUnique({
      where: { id: Number(tutorId) },
      include: { tutorProfile: true }
    });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    if (tutor.role !== "tutor" || !tutor.tutorProfile) {
      return res.status(400).json({ message: "Selected user is not a tutor" });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: Number(subjectId) }
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const tutorTeachesSubject = await prisma.tutorSubject.findFirst({
      where: {
        tutorId: tutor.tutorProfile.id,
        subjectId: Number(subjectId)
      }
    });

    if (!tutorTeachesSubject) {
      return res.status(400).json({
        message: "This tutor does not teach the selected subject"
      });
    }

    const bookingDay = new Date(bookingDate).toLocaleDateString("en-US", {
      weekday: "long"
    });

    const availability = await prisma.availabilitySlot.findFirst({
      where: {
        tutorId: tutor.tutorProfile.id,
        dayOfWeek: {
          equals: bookingDay,
          mode: "insensitive"
        },
        startTime,
        endTime
      }
    });

    if (!availability) {
      return res.status(400).json({
        message: `Tutor is not available on ${bookingDay} from ${startTime} to ${endTime}`
      });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        tutorId: Number(tutorId),
        bookingDate,
        startTime,
        endTime,
        status: {
          in: ["requested", "accepted"]
        }
      }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This slot is already requested or booked"
      });
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: Number(studentId),
        tutorId: Number(tutorId),
        subjectId: Number(subjectId),
        bookingDate: bookingDate,
        startTime,
        endTime,
        requestMessage,
        status: "requested"
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        subject: true
      }
    });

    return res.status(201).json({
      message: "Booking requested successfully",
      booking
    });
  } catch (error) {
    console.error("Request booking error:", error);
    return res.status(500).json({
      message: "Error requesting booking",
      error: error.message
    });
  }
};

// GET STUDENT BOOKINGS
const getStudentBookings = async (req, res) => {
  try {
    const { studentId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        studentId: Number(studentId)
      },
      include: {
        tutor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        subject: true
      },
      orderBy: {
        bookingDate: "asc"
      }
    });

    return res.status(200).json({
      message: "Student bookings fetched successfully",
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Get student bookings error:", error);
    return res.status(500).json({
      message: "Error fetching student bookings",
      error: error.message
    });
  }
};

// GET TUTOR BOOKINGS
const getTutorBookings = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        tutorId: Number(tutorId)
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        subject: true
      },
      orderBy: {
        bookingDate: "asc"
      }
    });

    return res.status(200).json({
      message: "Tutor bookings fetched successfully",
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error("Get tutor bookings error:", error);
    return res.status(500).json({
      message: "Error fetching tutor bookings",
      error: error.message
    });
  }
};

// ACCEPT BOOKING
const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "requested") {
      return res.status(400).json({
        message: "Only requested bookings can be accepted"
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: { status: "accepted" }
    });

    return res.status(200).json({
      message: "Booking accepted successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error("Accept booking error:", error);
    return res.status(500).json({
      message: "Error accepting booking",
      error: error.message
    });
  }
};

// REJECT BOOKING
const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "requested") {
      return res.status(400).json({
        message: "Only requested bookings can be rejected"
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: { status: "rejected" }
    });

    return res.status(200).json({
      message: "Booking rejected successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error("Reject booking error:", error);
    return res.status(500).json({
      message: "Error rejecting booking",
      error: error.message
    });
  }
};

// CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Completed bookings cannot be cancelled"
      });
    }

    if (booking.status === "rejected") {
      return res.status(400).json({
        message: "Rejected bookings cannot be cancelled"
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: { status: "cancelled" }
    });

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({
      message: "Error cancelling booking",
      error: error.message
    });
  }
};

// COMPLETE BOOKING
const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted bookings can be marked as completed"
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: { status: "completed" }
    });

    return res.status(200).json({
      message: "Booking completed successfully. Review is now unlocked.",
      booking: updatedBooking
    });
  } catch (error) {
    console.error("Complete booking error:", error);
    return res.status(500).json({
      message: "Error completing booking",
      error: error.message
    });
  }
};

module.exports = {
  requestBooking,
  getStudentBookings,
  getTutorBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  completeBooking
};
const prisma = require("../prisma");

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, feedback } = req.body || {};
    const studentId = req.user.userId;

    if (!bookingId || !studentId || !rating) {
      return res.status(400).json({
        message: "bookingId, studentId, and rating are required"
      });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: {
        student: true,
        tutor: {
          include: {
            tutorProfile: true
          }
        },
        review: true
      }
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "Review can be added only after booking is completed"
      });
    }

    if (booking.studentId !== Number(studentId)) {
      return res.status(403).json({
        message: "Only the student who booked the session can review"
      });
    }

    if (booking.review) {
      return res.status(409).json({
        message: "Review already exists for this booking"
      });
    }

    if (!booking.tutor.tutorProfile) {
      return res.status(400).json({
        message: "Tutor profile not found"
      });
    }

    const review = await prisma.review.create({
      data: {
        bookingId: Number(bookingId),
        studentId: Number(studentId),
        tutorId: booking.tutorId,
        rating: numericRating,
        feedback
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
        booking: true
      }
    });

    const tutorReviews = await prisma.review.findMany({
      where: {
        tutorId: booking.tutorId
      }
    });

    const totalRating = tutorReviews.reduce((sum, item) => {
      return sum + item.rating;
    }, 0);

    const averageRating = totalRating / tutorReviews.length;

    const completedSessions = await prisma.booking.count({
      where: {
        tutorId: booking.tutorId,
        status: "completed"
      }
    });

    await prisma.tutorProfile.update({
      where: {
        userId: booking.tutorId
      },
      data: {
        averageRating,
        totalSessionsCompleted: completedSessions
      }
    });

    return res.status(201).json({
      message: "Review submitted successfully",
      review,
      updatedTutorStats: {
        averageRating,
        totalSessionsCompleted: completedSessions
      }
    });
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({
      message: "Error creating review",
      error: error.message
    });
  }
};

// GET REVIEWS FOR TUTOR
const getTutorReviews = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const tutor = await prisma.user.findUnique({
      where: { id: Number(tutorId) },
      include: {
        tutorProfile: true
      }
    });

    if (!tutor || tutor.role !== "tutor") {
      return res.status(404).json({
        message: "Tutor not found"
      });
    }

    const reviews = await prisma.review.findMany({
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
        booking: {
          include: {
            subject: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({
      message: "Tutor reviews fetched successfully",
      averageRating: tutor.tutorProfile?.averageRating || 0,
      totalSessionsCompleted: tutor.tutorProfile?.totalSessionsCompleted || 0,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error("Get tutor reviews error:", error);
    return res.status(500).json({
      message: "Error fetching tutor reviews",
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getTutorReviews
};
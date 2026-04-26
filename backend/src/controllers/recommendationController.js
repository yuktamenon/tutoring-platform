const prisma = require("../prisma");

// RECOMMENDED TUTORS FOR STUDENT
const getRecommendedTutors = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (Number(studentId) !== req.user.userId) {
        return res.status(403).json({
            message: "You can only view your own recommendations"
        });
    }
    const student = await prisma.user.findUnique({
      where: { id: Number(studentId) }
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        message: "Recommendations are available only for students"
      });
    }

    const studentBookings = await prisma.booking.findMany({
      where: {
        studentId: Number(studentId),
        status: {
          in: ["accepted", "completed"]
        }
      },
      include: {
        subject: true
      }
    });

    if (studentBookings.length === 0) {
      const popularTutors = await prisma.tutorProfile.findMany({
        take: 5,
        orderBy: [
          { averageRating: "desc" },
          { totalSessionsCompleted: "desc" }
        ],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          subjects: {
            include: {
              subject: true
            }
          },
          availability: true
        }
      });

      return res.status(200).json({
        message: "No previous bookings found. Showing popular tutors.",
        recommendations: popularTutors.map((tutor) => ({
          tutor,
          reason: "Popular tutor with strong rating or completed sessions"
        }))
      });
    }

    const bookedSubjectIds = [
      ...new Set(studentBookings.map((booking) => booking.subjectId))
    ];

    const recommendedTutors = await prisma.tutorProfile.findMany({
      where: {
        subjects: {
          some: {
            subjectId: {
              in: bookedSubjectIds
            }
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        subjects: {
          include: {
            subject: true
          }
        },
        availability: true
      },
      orderBy: [
        { averageRating: "desc" },
        { totalSessionsCompleted: "desc" }
      ],
      take: 5
    });

    const subjectNames = studentBookings.map((booking) => booking.subject.name);
    const uniqueSubjectNames = [...new Set(subjectNames)];

    const recommendations = recommendedTutors.map((tutor) => {
      const tutorSubjectNames = tutor.subjects.map((item) => item.subject.name);

      const matchingSubjects = tutorSubjectNames.filter((subjectName) =>
        uniqueSubjectNames.includes(subjectName)
      );

      return {
        tutor,
        reason:
          matchingSubjects.length > 0
            ? `Recommended because you previously booked ${matchingSubjects.join(", ")}`
            : "Recommended based on your booking history"
      };
    });

    return res.status(200).json({
      message: "Recommended tutors fetched successfully",
      basedOnSubjects: uniqueSubjectNames,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error("Recommended tutors error:", error);
    return res.status(500).json({
      message: "Error fetching recommended tutors",
      error: error.message
    });
  }
};

// SUBJECT LEARNING PATH RECOMMENDATIONS
const getLearningPathRecommendations = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.user.findUnique({
      where: { id: Number(studentId) }
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        message: "Learning path recommendations are available only for students"
      });
    }

    const studentBookings = await prisma.booking.findMany({
      where: {
        studentId: Number(studentId),
        status: {
          in: ["accepted", "completed"]
        }
      },
      include: {
        subject: true
      }
    });

    if (studentBookings.length === 0) {
      return res.status(200).json({
        message: "No previous bookings found. Learning path cannot be generated yet.",
        recommendations: []
      });
    }

    const bookedSubjectIds = [
      ...new Set(studentBookings.map((booking) => booking.subjectId))
    ];

    const learningPaths = await prisma.learningPath.findMany({
      where: {
        fromSubjectId: {
          in: bookedSubjectIds
        },
        toSubjectId: {
          notIn: bookedSubjectIds
        }
      },
      include: {
        fromSubject: true,
        toSubject: true
      }
    });

    const recommendations = learningPaths.map((path) => ({
      fromSubject: path.fromSubject.name,
      recommendedNextSubject: path.toSubject.name,
      reason: `Because you studied ${path.fromSubject.name}, ${path.toSubject.name} is a good next subject.`
    }));

    return res.status(200).json({
      message: "Learning path recommendations fetched successfully",
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error("Learning path recommendation error:", error);
    return res.status(500).json({
      message: "Error fetching learning path recommendations",
      error: error.message
    });
  }
};

// CREATE LEARNING PATH RULE
const createLearningPath = async (req, res) => {
  try {
    const { fromSubjectId, toSubjectId } = req.body || {};

    if (!fromSubjectId || !toSubjectId) {
      return res.status(400).json({
        message: "fromSubjectId and toSubjectId are required"
      });
    }

    if (Number(fromSubjectId) === Number(toSubjectId)) {
      return res.status(400).json({
        message: "fromSubjectId and toSubjectId cannot be same"
      });
    }

    const fromSubject = await prisma.subject.findUnique({
      where: { id: Number(fromSubjectId) }
    });

    const toSubject = await prisma.subject.findUnique({
      where: { id: Number(toSubjectId) }
    });

    if (!fromSubject || !toSubject) {
      return res.status(404).json({
        message: "One or both subjects not found"
      });
    }

    const existingPath = await prisma.learningPath.findFirst({
      where: {
        fromSubjectId: Number(fromSubjectId),
        toSubjectId: Number(toSubjectId)
      }
    });

    if (existingPath) {
      return res.status(409).json({
        message: "Learning path already exists"
      });
    }

    const learningPath = await prisma.learningPath.create({
      data: {
        fromSubjectId: Number(fromSubjectId),
        toSubjectId: Number(toSubjectId)
      },
      include: {
        fromSubject: true,
        toSubject: true
      }
    });

    return res.status(201).json({
      message: "Learning path created successfully",
      learningPath
    });
  } catch (error) {
    console.error("Create learning path error:", error);
    return res.status(500).json({
      message: "Error creating learning path",
      error: error.message
    });
  }
};

module.exports = {
  getRecommendedTutors,
  getLearningPathRecommendations,
  createLearningPath
};
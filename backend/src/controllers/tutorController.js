const prisma = require("../prisma");

// CREATE TUTOR PROFILE
const createTutorProfile = async (req, res) => {
  try {
    const { bio, rate, experience } = req.body || {};
    const userId = req.user.userId;

    if (!userId || !bio || !rate || !experience) {
      return res.status(400).json({
        message: "userId, bio, rate, and experience are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Optional but recommended: only tutors can create tutor profiles
    if (user.role !== "tutor") {
      return res.status(400).json({
        message: "This user is not registered as a tutor"
      });
    }

    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: Number(userId) }
    });

    if (existingProfile) {
      return res.status(409).json({
        message: "Tutor profile already exists for this user"
      });
    }

    const profile = await prisma.tutorProfile.create({
      data: {
        bio,
        rate: Number(rate),
        experience,
        user: {
          connect: { id: Number(userId) }
        }
      }
    });

    return res.status(201).json({
      message: "Tutor profile created successfully",
      profile
    });
  } catch (error) {
    console.error("Create tutor profile error:", error);
    return res.status(500).json({
      message: "Error creating tutor profile",
      error: error.message
    });
  }
};

// GET TUTOR PROFILE
const getTutorProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: Number(userId) },
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

    if (!profile) {
      return res.status(404).json({
        message: "Tutor profile not found"
      });
    }

    return res.json(profile);
  } catch (error) {
    console.error("Get tutor profile error:", error);
    return res.status(500).json({
      message: "Error fetching tutor profile",
      error: error.message
    });
  }
};
const assignSubjectToTutor = async (req, res) => {
  try {
    const { tutorId, subjectId } = req.body || {};

    if (!tutorId || !subjectId) {
      return res.status(400).json({
        message: "tutorId and subjectId are required"
      });
    }

    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: Number(tutorId) }
    });

    if (!tutor) {
      return res.status(404).json({
        message: "Tutor profile not found"
      });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: Number(subjectId) }
    });

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found"
      });
    }

    const existingAssignment = await prisma.tutorSubject.findFirst({
      where: {
        tutorId: Number(tutorId),
        subjectId: Number(subjectId)
      }
    });

    if (existingAssignment) {
      return res.status(409).json({
        message: "This subject is already assigned to the tutor"
      });
    }

    const tutorSubject = await prisma.tutorSubject.create({
      data: {
        tutorId: Number(tutorId),
        subjectId: Number(subjectId)
      }
    });

    return res.status(201).json({
      message: "Subject assigned to tutor successfully",
      tutorSubject
    });
  } catch (error) {
    console.error("Assign subject error:", error);
    return res.status(500).json({
      message: "Error assigning subject to tutor",
      error: error.message
    });
  }
};

const getTutorSubjects = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const tutorSubjects = await prisma.tutorSubject.findMany({
      where: {
        tutorId: Number(tutorId)
      },
      include: {
        subject: true
      }
    });

    return res.status(200).json({
      message: "Tutor subjects fetched successfully",
      tutorSubjects
    });
  } catch (error) {
    console.error("Get tutor subjects error:", error);
    return res.status(500).json({
      message: "Error fetching tutor subjects",
      error: error.message
    });
  }
};

const searchTutors = async (req, res) => {
  try {
    const { subject, minRate, maxRate, minRating, dayOfWeek } = req.query;

    const filters = {};

    // Price filter
    if (minRate || maxRate) {
      filters.rate = {};

      if (minRate) {
        filters.rate.gte = Number(minRate);
      }

      if (maxRate) {
        filters.rate.lte = Number(maxRate);
      }
    }

    // Rating filter
    if (minRating) {
      filters.averageRating = {
        gte: Number(minRating)
      };
    }

    const tutors = await prisma.tutorProfile.findMany({
      where: {
        ...filters,

        // Subject filter
        ...(subject
          ? {
              subjects: {
                some: {
                  subject: {
                    name: {
                      equals: subject,
                      mode: "insensitive"
                    }
                  }
                }
              }
            }
          : {}),

        // Availability day filter
        ...(dayOfWeek
          ? {
              availability: {
                some: {
                  dayOfWeek: {
                    equals: dayOfWeek,
                    mode: "insensitive"
                  }
                }
              }
            }
          : {})
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

      orderBy: {
        averageRating: "desc"
      }
    });

    return res.status(200).json({
      message: "Tutors fetched successfully",
      count: tutors.length,
      tutors
    });
  } catch (error) {
    console.error("Search tutors error:", error);
    return res.status(500).json({
      message: "Error searching tutors",
      error: error.message
    });
  }
};
module.exports = {
  createTutorProfile,
  getTutorProfile,
  assignSubjectToTutor,
  getTutorSubjects,
  searchTutors
};
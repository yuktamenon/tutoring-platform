const prisma = require("../prisma");

const createAvailabilitySlot = async (req, res) => {
  try {
    const { tutorId, dayOfWeek, startTime, endTime } = req.body || {};

    if (!tutorId || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({
        message: "tutorId, dayOfWeek, startTime, and endTime are required"
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

    const slot = await prisma.availabilitySlot.create({
      data: {
        tutorId: Number(tutorId),
        dayOfWeek,
        startTime,
        endTime
      }
    });

    return res.status(201).json({
      message: "Availability slot created successfully",
      slot
    });
  } catch (error) {
    console.error("Create availability error:", error);
    return res.status(500).json({
      message: "Error creating availability slot",
      error: error.message
    });
  }
};

const getTutorAvailability = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const slots = await prisma.availabilitySlot.findMany({
      where: {
        tutorId: Number(tutorId)
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" }
      ]
    });

    return res.status(200).json({
      message: "Availability fetched successfully",
      count: slots.length,
      slots
    });
  } catch (error) {
    console.error("Get availability error:", error);
    return res.status(500).json({
      message: "Error fetching availability",
      error: error.message
    });
  }
};

const deleteAvailabilitySlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const existingSlot = await prisma.availabilitySlot.findUnique({
      where: { id: Number(slotId) }
    });

    if (!existingSlot) {
      return res.status(404).json({
        message: "Availability slot not found"
      });
    }

    await prisma.availabilitySlot.delete({
      where: { id: Number(slotId) }
    });

    return res.status(200).json({
      message: "Availability slot deleted successfully"
    });
  } catch (error) {
    console.error("Delete availability error:", error);
    return res.status(500).json({
      message: "Error deleting availability slot",
      error: error.message
    });
  }
};

module.exports = {
  createAvailabilitySlot,
  getTutorAvailability,
  deleteAvailabilitySlot
};
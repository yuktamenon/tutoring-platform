const prisma = require("../prisma");

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const { bookingId, content } = req.body || {};
    const senderId = req.user.userId;

    if (!bookingId || !senderId || !content) {
      return res.status(400).json({
        message: "bookingId, senderId, and content are required"
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const sender = await prisma.user.findUnique({
      where: { id: Number(senderId) }
    });

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found"
      });
    }

    const isParticipant =
      booking.studentId === Number(senderId) ||
      booking.tutorId === Number(senderId);

    if (!isParticipant) {
      return res.status(403).json({
        message: "Only the student or tutor of this booking can send messages"
      });
    }

    if (booking.status === "rejected" || booking.status === "cancelled") {
      return res.status(400).json({
        message: "Cannot send messages for rejected or cancelled bookings"
      });
    }

    const message = await prisma.message.create({
      data: {
        bookingId: Number(bookingId),
        senderId: Number(senderId),
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return res.status(201).json({
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      message: "Error sending message",
      error: error.message
    });
  }
};

// GET MESSAGES BY BOOKING
const getMessagesByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) }
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        bookingId: Number(bookingId)
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        sentAt: "asc"
      }
    });

    return res.status(200).json({
      message: "Messages fetched successfully",
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({
      message: "Error fetching messages",
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getMessagesByBooking
};
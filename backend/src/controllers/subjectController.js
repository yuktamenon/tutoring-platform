const prisma = require("../prisma");

const createSubject = async (req, res) => {
  try {
    const { name } = req.body;

    const subject = await prisma.subject.create({
      data: { name }
    });

    res.json(subject);

  } catch (error) {
    res.status(500).json({ error: "Error creating subject" });
  }
};

const getSubjects = async (req, res) => {
  const subjects = await prisma.subject.findMany();
  res.json(subjects);
};

module.exports = { createSubject, getSubjects };
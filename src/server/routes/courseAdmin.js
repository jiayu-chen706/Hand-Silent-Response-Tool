const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const db = require("../models");
const verifyTeacher = require("../routes/verifyTeacher");

const Course = db.Course;
const Class = db.Class;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// get a record from table and use it as the argument of a function
async function lookup_pk(table, pk, res, fn, options=null) {
  try {
    const record = await table.findByPk(pk, options)
    if (!record) {
      return res.sendStatus(404)
    }
    await fn(record)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
}

// Create Course
router.post("/create-course", verifyTeacher, async (req, res) => {
  const { name } = req.body;
  const teacherId = req.teacherId;
  // Check if name and teacherId are provided
  if (!name || !teacherId) {
    return res.status(400).json({ message: "Missing course name or teacherId." });
  }
  // Check if the course already exists for this teacher
  try {
    const newCourse = await Course.create({ name, teacherId });
    // Return success response
    return res.status(201).json({
      message: "Course created.",
      course: newCourse
    });
  } catch (err) {
    console.error("Create course error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Create Class
router.post("/create-class", verifyTeacher, async (req, res) => {
  const { name, courseId } = req.body;
  const teacherId = req.teacherId;
  // Check if name and courseId are provided
  if (!name || !courseId) {
    return res.status(400).json({ message: "Missing class name or courseId." });
  }
  // Check if the course exists and belongs to the teacher
  try {
    const course = await Course.findOne({ where: { id: courseId, teacherId } });
    if (!course) {
      return res.status(403).json({ message: "You do not have permission to add classes to this course." });
    }
    // Generate a unique invite code
    let inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Total allowed attempts is 10
    let tries = 10;
    while (await Class.findOne({ where: { inviteCode } }) && tries > 0) {
      inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      tries--;
    }
    // If we exhaust all attempts, return an error
    if (tries === 0) {
      return res.status(500).json({ message: "Failed to generate unique invite code." });
    }
    // Generate QR code for the class invite link
    // The QR code will link to a URL where students can join the class
    const qrText = `${BASE_URL}/join-class/${inviteCode}`;
    const qrCode = await QRCode.toDataURL(qrText);
    // Create the class in the database
    const newClass = await Class.create({
      name,
      courseId,
      inviteCode,
      qrCode,
      isActive: true
    });
    // Return success response
    return res.status(201).json({
      message: "Class created.",
      class: newClass
    });
  } catch (err) {
    console.error("Create class error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get class details by class ID
router.get("/class/:id", async (req, res) => {
  const class_id = req.params.id;

  // lookup_pk is a helper that fetches a model instance by primary key, handles 404 if not found
  lookup_pk(Class, class_id, res, async (cls) => {
    try {
      // Return the class details as JSON
      res.json({
        id: cls.id,
        name: cls.name,
        inviteCode: cls.inviteCode,
        qrCode: cls.qrCode,
        isActive: cls.isActive
        // You can add more fields here if needed, like enrolled students, etc.
      });
    } catch (err) {
      console.error("Error fetching class details:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

// Get class details by inviteCode
router.get("/class/invite/:inviteCode", async (req, res) => {
  const inviteCode = req.params.inviteCode.toUpperCase();

  try {
    const cls = await Class.findOne({ where: { inviteCode } });
    if (!cls) {
      return res.status(404).json({ message: "Class not found with this invite code." });
    }
    // Return the class details as JSON
    res.json({
      id: cls.id,
      name: cls.name,
      inviteCode: cls.inviteCode,
      qrCode: cls.qrCode,
      isActive: cls.isActive
    });
  } catch (err) {
    console.error("Error fetching class by inviteCode:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// POST /api/admin/close-session
router.post("/close-session", verifyTeacher, async (req, res) => {
  const { classId } = req.body;
  const teacherId = req.teacherId;
  console.log("teacherId in req:", req.teacherId);

  // Check if classId is provided
  if (!classId) {
    return res.status(400).json({ message: "Missing classId." });
  }
  // Check if the class exists and belongs to the teacher
  try {
    const classToUpdate = await Class.findByPk(classId, {
      include: [{
        model: Course,
        attributes: ['teacherId']
      }]
    });
    // If class not found, return 404
    if (!classToUpdate) {
      return res.status(404).json({ message: "Class not found." });
    }
    // If the class does not belong to the teacher, return 403
    if (classToUpdate.Course.teacherId !== teacherId) {
      return res.status(403).json({ message: "You are not authorized to close this class." });
    }
    classToUpdate.isActive = false;
    await classToUpdate.save();
    // Return success response
    return res.status(200).json({
      message: "Class session closed.",
      class: classToUpdate
    });
  } catch (err) {
    console.error("Close session error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;

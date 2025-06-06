const express = require("express");
const router = express.Router();
const db = require("../models");

const Student = db.Student;
const Class = db.Class;
const Course = db.Course;
const Teacher = db.Teacher;

// POST /api/student/register
router.post("/register", async (req, res) => {
  const { name, studentID, inviteCode } = req.body;
  // check if name, studentID, and inviteCode are provided
  if (!name || !studentID || !inviteCode) {
    return res.status(400).json({ message: "Missing name, studentID, or inviteCode." });
  }
  try {
    // check if this inviteCode relates to a class
    const foundClass = await Class.findOne({ where: { inviteCode } });
    if (!foundClass) {
      return res.status(404).json({ message: "Class not found for this inviteCode." });
    }
    // create a new student record
    const newStudent = await Student.create({
      name,
      studentID,
      classId: foundClass.id
    });
    // return success response
    return res.status(201).json({
      message: "Student registered.",
      student: newStudent
    });
  } catch (err) {
    console.error("Register student error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// GET /api/student/class-info/:inviteCode
router.get("/class-info/:inviteCode", async (req, res) => {
  const { inviteCode } = req.params;
  // check if inviteCode is provided
  try {
    // check if this inviteCode relates to a class
    const foundClass = await Class.findOne({ where: { inviteCode } });
    if (!foundClass) {
      return res.status(404).json({ message: "Class not found." });
    }
    // fetch the course and teacher information
    const course = await Course.findByPk(foundClass.courseId);
    const teacher = await Teacher.findByPk(course.teacherId);
    // return success response with class, course, and teacher info
    return res.status(200).json({
      teacherName: teacher.name,
      courseName: course.name,
      class: foundClass
    });
  } catch (err) {
    console.error("Fetch class info error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// student quit-session
router.post("/quit-session", async (req, res) => {
  const { studentId } = req.body;
  console.log("Received body:", req.body);
  // check if studentId is provided
  if (!studentId) {
    return res.status(400).json({ message: "Missing studentID." });
  }
  // check if the student exists
  try {
    const student = await Student.findOne({ where: { id: studentId } });
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    // set the classId to null to indicate the student has quit the session
    student.classId = null;
    await student.save();
    // return success response
    return res.status(200).json({
      message: "Student has quit the session.",
      student
    });
  } catch (err) {
    console.error("Quit session error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
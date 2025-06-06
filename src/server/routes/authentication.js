const express = require("express");
const router = express.Router();
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Teacher = db.Teacher;

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key"; // fallback for dev

// Teacher registration
router.post("/register", async (req, res) => {
  const { username, password, name } = req.body;

  // check if all fields are provided
  if (!username || !password || !name) {
    return res.status(400).json({ message: "All fields required." });
  }
  // check if username is valid
  try {
    const existing = await Teacher.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: "Username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password
    // create a new teacher record
    const newTeacher = await Teacher.create({
      username,
      password: hashedPassword,
      name
    });
    // return success response
    return res.status(201).json({
      message: "Teacher registered.",
      teacherId: newTeacher.id,
      name: newTeacher.name,
      username: newTeacher.username
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Teacher login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required." });
  }
  // find the teacher by username and verify password
  try {
    const teacher = await Teacher.findOne({ where: { username } });
    if (!teacher) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    // compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }
    // generate a JWT token
    const token = jwt.sign(
      { teacherId: teacher.id },
      SECRET_KEY,
      { expiresIn: "3h" }
    );
    // return success response with token and teacher details
    return res.status(200).json({
      message: "Login successful.",
      token_type: "Bearer",
      token,
      teacherId: teacher.id,
      name: teacher.name,
      username: teacher.username
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;

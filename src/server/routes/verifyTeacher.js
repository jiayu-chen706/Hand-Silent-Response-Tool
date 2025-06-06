const db = require("../models");
const Teacher = db.Teacher;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key"; // fallback for dev

const verifyTeacher = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header." });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found in Authorization header." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.teacherId = decoded.teacherId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};


module.exports = verifyTeacher;
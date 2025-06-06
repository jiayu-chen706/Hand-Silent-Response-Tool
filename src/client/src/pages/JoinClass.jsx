import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../api/urls";
import "../styles/JoinClass.css";

// Define JoinClass component
const JoinClass = () => {
  const { inviteCode: inviteCodeFromURL } = useParams();
  const [inviteCode, setInviteCode] = useState(inviteCodeFromURL || "");   // Input: invite code
  const [studentName, setStudentName] = useState(""); // Input: student name
  const [studentID, setStudentID] = useState("");     // Input: student ID
  const [joining, setJoining] = useState(false);      // State for loading UI
  const [error, setError] = useState("");             // Error message

  const navigate = useNavigate();


  useEffect(() => {
    if (inviteCodeFromURL) {
      setInviteCode(inviteCodeFromURL);
    }
  }, [inviteCodeFromURL]);

  // Handle student attempting to join class
  const handleJoin = async () => {
    setError("");

    // Validate form fields
    if (!inviteCode || !studentName || !studentID) {
      setError("Please enter your name, student ID and the invite code.");
      return;
    }

    setJoining(true);
    try {
      // Step 1: Get class info using the invite code
      const resClass = await axios.get(`${BASE_URL}/api/admin/class/invite/${inviteCode}`);
      const classInfo = resClass.data;

      // Step 2: Check if the class is active
      if (!classInfo.isActive) {
        setError("This session is not active.");
        setJoining(false);
        return;
      }

      // Step 3: Register student into the class
      const resStudent = await axios.post(`${BASE_URL}/api/student/register`, {
        name: studentName,
        studentID: studentID,
        inviteCode: inviteCode,
      });

      const studentInfo = resStudent?.data?.student;

      // Save session info to localStorage
      localStorage.setItem("studentId", studentInfo.id);
      localStorage.setItem("classId", studentInfo.classId);
      localStorage.setItem("role", "student");
      localStorage.setItem("inviteCode", inviteCode);

      alert("Successfully joined the session!");
      navigate(`/student-home/${inviteCode}`);
    } catch (err) {
      console.error("Error joining class:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to join the class. Please check the code and try again.");
      }
    }
    setJoining(false);
  };

  return (
    <div className="join-class-container">
      <h1>Join a Class</h1>

      {/* Name input */}
      <div className="form-group">
        <label>Your Name</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      {/* Student ID input */}
      <div className="form-group">
        <label>Your Student ID</label>
        <input
          type="text"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
          placeholder="Enter your Student ID"
        />
      </div>

      {/* Invite code input */}
      {!inviteCodeFromURL && (
        <div className="form-group">
          <label>Invite Code</label>
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter invite code from QR"
          />
        </div>
      )}

      {/* Display error message */}
      {error && <div className="error-text">{error}</div>}

      {/* Submit button */}
      <button
        className="join-class-btn"
        onClick={handleJoin}
        disabled={joining}
      >
        {joining ? "Joining..." : "Join Class"}
      </button>
    </div>
  );
};

export default JoinClass;

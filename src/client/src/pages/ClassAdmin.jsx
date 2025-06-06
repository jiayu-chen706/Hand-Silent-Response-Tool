import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/urls";
import "../styles/ClassAdmin.css";
import message from '../assets/comments.png';
import authAxios from '../utils/authAxios';

// ClassAdmin page for managing a single class session
const ClassAdmin = () => {
  const { classId } = useParams(); // get class ID from URL
  const navigate = useNavigate();

  const [hasNewMessages, setHasNewMessages] = useState(false); // whether there are unread responses
  const teacherId = localStorage.getItem("teacherId");

  const [classInfo, setClassInfo] = useState(null); // class session info
  const [students, setStudents] = useState([]); // list of students who joined
  const [closing, setClosing] = useState(false); // session closing state

  useEffect(() => {
    // Validate teacher Id and class Id
    if (!classId || !teacherId) {
      alert("Invalid session or teacher info.");
      navigate("/course-admin");
      return;
    }

    // Fetch silent response unread status
    const fetchResponsesStatus = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/SilentResponse/byTeacher/${teacherId}`);
        const responseList = res.data;
        const hasUnread = responseList.some(response => response.isUnread === true);
        setHasNewMessages(hasUnread); // set red dot if any unread
      } catch (error) {
        console.error(`Failed to fetch feedback for teacher ${teacherId}:`, error);
      }
    };

    // Fetch class info and joined students
    const fetchClassInfo = async () => {
      try {
        const resClass = await axios.get(`${BASE_URL}/api/admin/class/${classId}`);
        setClassInfo(resClass.data);
  
        const resStudents = await axios.get(`${BASE_URL}/SilentResponse/students/byClass/${classId}`);
        setStudents(resStudents.data);
        console.log(resStudents.data);
      } catch (err) {
        console.error("Error fetching class info", err);
      }
    };

    // Initial fetch
    fetchClassInfo();
    fetchResponsesStatus();

    // Poll for updates every 3 seconds
    const interval = setInterval(() => {
      fetchClassInfo();
      fetchResponsesStatus();
    }, 3000);
  
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [classId, navigate, teacherId]);

  // Handler for closing the session
  const handleCloseSession = async () => {
    if (!window.confirm("Are you sure you want to close this session? This action cannot be undone.")) {
      return;
    }
    setClosing(true);
    try {
      await authAxios.post(`${BASE_URL}/api/admin/close-session`, { classId });
      alert("Session closed successfully");
      localStorage.removeItem("classId");
      navigate("/course-admin"); // redirect to course admin
    } catch (err) {
      console.error("Error closing session", err);
      alert("Failed to close session. Please try again.");
      setClosing(false);
    }
  };

  if (!classInfo) return <div className="error">Class/session not found.</div>;

  return (
    <div className="class-admin-container">
      <h2>Session:</h2>
      <h3>{classInfo.name}</h3>

      {/* QR code and invite code */}
      <div className="session-info">
        <img
          src={classInfo.qrCode}
          alt="Session QR Code"
          className="qr-code"
        />
        <p className="invite-code">
          Invite Code: <span>{classInfo.inviteCode}</span>
        </p>
      </div>

      {/* Student list */}
      <div className="students-list">
        <h2>Joined Students ({students.length})</h2>
        {students.length === 0 ? (
          <p>No students have joined yet.</p>
        ) : (
          <ul>
            {students.map((student) => (
              <li key={student.id}>
                {student.name} ({student.studentID})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Close session button */}
      <button
        className="close-session-btn"
        onClick={handleCloseSession}
        disabled={closing}
      >
        {closing ? "Closing..." : "Close Session"}
      </button>

      {/* Inbox icon — red dot appears if there are new responses */}
      <div
        className="inbox-icon"
        onClick={() => navigate('/teacher-inbox')}
        title="Go to Inbox"
      >
        <img src={message} alt='response' />
        {hasNewMessages && <span className="notification-dot"></span>}
      </div>
    </div>
  );
};

export default ClassAdmin;

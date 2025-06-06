import React, { useState } from 'react';
import axios from "axios";
import '../styles/Navbar.css';
import { IoMdLogOut } from "react-icons/io";
import { FaChalkboardTeacher } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMenu } from "react-icons/ai";
import { FiHome } from "react-icons/fi";
import { SiGoogleclassroom } from "react-icons/si";
import { PiKeyReturnBold } from "react-icons/pi";
import { BASE_URL } from "../api/urls";
import { LuMessageSquareText } from "react-icons/lu";

// Navbar component for displaying the top navigation bar.
function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const inviteCode = localStorage.getItem("inviteCode");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
    setMenuOpen(false);
  };

  const handleReturnClass = () => {
    const classId = localStorage.getItem("classId");
    if (!classId) {
      alert("You are not currently hosting any class. Please  start a class.");
      return;
    }
    navigate(`/class/${classId}`);
    setMenuOpen(false);
  };

  const handleLeaveClass = async () => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      console.error("No studentId in localStorage");
      return;
    }
  
    try {
      await axios.post(`${BASE_URL}/api/student/quit-session`, { studentId });
      navigate('/join-class');
      setMenuOpen(false);
      localStorage.clear();
    } catch (error) {
      console.error("Failed to quit session:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="menu-container">
        <button
          className="image-button"
          onClick={() => setMenuOpen(prev => !prev)}
          title="Menu"
        >
          <AiOutlineMenu />
        </button>

        {menuOpen && (
          <ul className="menu-list">
            {role === "teacher" && (
              <>
                <li onClick={handleLogout}>
                  <IoMdLogOut style={{ marginRight: '8px' }} />
                  Logout
                </li>
                <li 
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/course-admin");
                  }}
                >
                  <FiHome style={{ marginRight: '8px' }} />
                  Course Admin
                </li>
                <li 
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/teacher-inbox");
                  }}
                  >
                  <LuMessageSquareText style={{ marginRight: '8px' }} />
                  Silent Responses
                </li>
                <li onClick={handleReturnClass}>
                  <SiGoogleclassroom style={{ marginRight: '8px' }} />
                  Back to Class
                </li>
              </>
            )}

            {role === "student" && (
              <>
                <li 
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/student-home/${inviteCode}`);
                  }}
                >
                  <FaChalkboardTeacher style={{ marginRight: '8px' }} />
                  Classroom
                </li>
                <li onClick={handleLeaveClass}>
                  <PiKeyReturnBold style={{ marginRight: '8px' }} />
                  Leave Class
                </li>
              </>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

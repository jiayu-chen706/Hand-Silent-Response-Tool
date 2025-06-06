import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/urls";
import "../styles/CourseAdmin.css";
import { FiPlay } from "react-icons/fi";
import authAxios from '../utils/authAxios';

// Define CourseAdmin component
const CourseAdmin = () => {
  const teacherId = localStorage.getItem("teacherId"); // Get teacher ID from local storage
  const [courses, setCourses] = useState([]); // List of all courses
  const [newCourseName, setNewCourseName] = useState(""); // New course name input
  const navigate = useNavigate();

  // Fetch courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/SilentResponse/courses/byTeacher/${teacherId}`);
        setCourses(res.data); // Set courses from API response
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };
    fetchCourses();
  }, [teacherId]);

  // Create a new course
  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
  
    try {  
      const res = await authAxios.post("/api/admin/create-course",
        { name: newCourseName },
      );
  
      setCourses([...courses, res.data.course]); // Add newly created course to the list
      setNewCourseName(""); // Reset input field
    } catch (err) {
      console.error("Error creating course", err);
    }
  };


  // Start a new session under a given course
  const handleStartSession = async (courseId, courseName) => {
    const confirmStart = window.confirm(`Are you sure you want to start a new session for "${courseName}"?`);
    if (!confirmStart) return;

    // Use timestamp in session name for uniqueness
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "");
    const sessionName = `${courseName}_${formattedDate}`; // e.g., Math101_20250519_1430

    try {
      const res = await authAxios.post("/api/admin/create-class", {
        name: sessionName,
        courseId,
      });
      console.log("Creating session with:", { name: sessionName, courseId });
    
      const newSession = res.data.class;
      localStorage.setItem("classId", newSession.id); // Store session ID in local storage
      navigate(`/class/${newSession.id}`); // Navigate to class admin page
    } catch (err) {
      console.error("Error starting session", err);
    }
  };

  return (
    <div className="course-admin-container">
      {/* Input field to create a new course */}
      <div className="create-course">
        <input
          type="text"
          placeholder="New course name"
          value={newCourseName}
          onChange={(e) => setNewCourseName(e.target.value)}
        />
        <button onClick={handleCreateCourse}>
          Add Course
        </button>
      </div>

      {/* List of existing courses */}
      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <div className="course-header">
              <h2>{course.name}</h2>
              <button
                className="start-session-btn"
                onClick={() => handleStartSession(course.id, course.name)}
              >
                <FiPlay /> Start Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseAdmin;

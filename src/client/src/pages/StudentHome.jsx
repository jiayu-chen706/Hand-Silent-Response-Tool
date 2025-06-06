import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/StudentHome.css';
import { BASE_URL } from "../api/urls";
import { MdSchool } from 'react-icons/md';
import { FaChalkboardTeacher } from 'react-icons/fa';
import classroomImg from '../assets/classroom.svg';

// ResponseButton component that navigates to the response submission page
const StudentHome = () => {
  const navigate = useNavigate();
  const { inviteCode } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/student/class-info/${inviteCode}`);
        const classData = response.data;
        setClassInfo(classData);
        console.log(classData);
  
        if (classData.isActive === false) {
          alert("The session has been closed.");
          navigate("/join-class");
          localStorage.clear();
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 404) {
          setError('Class not found');
        } else {
          setError('Server error');
        }
      } finally {
        setLoading(false);
      }
    };
  
    if (inviteCode) {
      fetchClassInfo();
    }
  
    const interval = setInterval(() => {
      fetchClassInfo();
    }, 5000);
  
    return () => clearInterval(interval);
  }, [inviteCode, navigate]);
  

  const handleClick = () => {
    // Navigate to the /submit-response route when the button is clicked
    navigate('/submit-response');
  };


  if (loading) return <div>Loading class info...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className='button-container'>
      <div className='class-info'>
        <h2><MdSchool style={{ verticalAlign: 'middle', marginRight: '8px', color: '#65558F' }} />Welcome to <span className="class-name">{classInfo.courseName}</span></h2>
        <p className="teacher-name"><FaChalkboardTeacher style={{ verticalAlign: 'middle', marginRight: '6px', color: '#65558F' }} />Teacher: <strong>{classInfo.teacherName || 'Unknown'}</strong></p>
      </div>
      <img src={classroomImg} alt="Classroom" className="classroom-img" />

      <button className='response-button' onClick={handleClick}>Silent Response</button>
      {/* <button className='response-button' onClick={handleLeaveClass}>Leave Class</button> */}
    </div>
  );
}

export default StudentHome;

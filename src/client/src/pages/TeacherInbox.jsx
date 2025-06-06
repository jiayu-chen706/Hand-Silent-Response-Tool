import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/TeacherInbox.css';
import avatarImg from '../assets/avatar.svg';
import { BASE_URL } from "../api/urls"; 

const TeacherInbox = () => {
  const [classList, setClassList] = useState([]); 
  const [subjectList, setSubjectList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('all'); 
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');
  const [responses, setResponses] = useState([]); 
  const [filter, setFilter] = useState('all'); 
  const [lastFetchedTime, setLastFetchedTime] = useState(null); 

  const navigate = useNavigate();
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/SilentResponse/courses/byTeacher/${teacherId}`)
      .then((res) => {
        console.log("Fetched subject list:", res.data);
        setSubjectList(res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching subject list:', err);
        setSubjectList([]);
      });
  }, [teacherId]);

  useEffect(() => {
    if (selectedSubjectId === 'all') {
      setClassList([]);
      return;
    }

    axios
      .get(`${BASE_URL}/SilentResponse/classes/byCourse/${selectedSubjectId}`)
      .then((res) => {
        setClassList(res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching class list:', err);
        setClassList([]);
      });
  }, [selectedSubjectId]);

  const fetchAndSetResponses = async (url) => {
    try {
      const res = await axios.get(url);
      setResponses(res.data || []);
      setLastFetchedTime(new Date());
    } catch (err) {
      console.error('Error fetching responses:', err);
      setResponses([]);
    }
  };

  const fetchResponses = useCallback(async () => {
    if (selectedClassId !== 'all') {
      await fetchAndSetResponses(`${BASE_URL}/SilentResponse/byClass/${selectedClassId}`);
    } else if (selectedSubjectId !== 'all') {
      await fetchAndSetResponses(`${BASE_URL}/SilentResponse/byCourse/${selectedSubjectId}`);
    } else {
      try {
        const allCourseIds = subjectList.map((s) => s.id);
        const promises = allCourseIds.map((id) =>
          axios.get(`${BASE_URL}/SilentResponse/byCourse/${id}`)
        );
        const results = await Promise.all(promises);
        const merged = results.flatMap((r) => r.data || []);
        setResponses(merged);
        setLastFetchedTime(new Date());
      } catch (err) {
        console.error('Error fetching all subject responses:', err);
        setResponses([]);
      }
    }
  }, [selectedClassId, selectedSubjectId, subjectList]);
  

  useEffect(() => {
    if (selectedClassId === null || selectedSubjectId === null) return;
    fetchResponses();
    const interval = setInterval(fetchResponses, 3000);
    return () => clearInterval(interval);
  }, [fetchResponses, selectedClassId, selectedSubjectId]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortedResponses = responses
    .filter(res => filter !== 'unread' || res.isUnread)
    .sort((a, b) => {
      const aUnread = a.isUnread;
      const bUnread = b.isUnread;
      if (aUnread !== bUnread) return aUnread ? -1 : 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Mark Response as read on the server
  const markResponseAsRead = async (responseId) => {
    try {
      const res = await axios.patch(`${BASE_URL}/SilentResponse/markRead/${responseId}`);
      console.log("mark as read:", res);
      console.log("Marked Response as read");
    } catch (error) {
      console.error("Failed to mark Response as read:", error);
    }
  };

  return (
    <div className="teacher-inbox">

      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Course:</label>
            <select
              className="filter-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <option value="all">All Courses</option>
              {subjectList.map((subj) => (
                <option key={subj.id} value={subj.id}>{subj.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Class:</label>
            <select
              className="filter-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="all">All Classes</option>
              {classList.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Show:</label>
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="unread">Unread Only</option>
            </select>
          </div>
        </div>
      </div>

      {lastFetchedTime && (
        <p className="last-updated">
          Last updated: {lastFetchedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}

      <div className="response-list">
        {sortedResponses.length === 0 ? (
          <p className="empty-msg">No responses yet.</p>
        ) : (
          sortedResponses.map((res) => (
            <div
              key={res.id}
              className="response-card clickable-card"
              onClick={() => {
                markResponseAsRead(res.id);
                navigate(`/teacher-response/${res.id}`);
              }}
            >
              <div className="avatar-name-wrapper">
                <img className="avatar-img" src={avatarImg} alt="Student Avatar" />
                <div className="response-content">
                  <p className={`student-name ${res.isUnread ? 'unread' : ''}`}>
                    {res.isAnonymous ? 'Anonymous' : res.Student?.name || 'Unnamed'}
                  </p>
                  <p className={`message ${res.isUnread ? 'unread' : ''}`}>
                    {res.text?.slice(0, 35)}{res.text?.length > 35 ? '...' : ''}
                  </p>
                </div>
              </div>
              <div className="right-info">
                {res.isUnread && <span className="unread-dot-right"></span>}
                <span className="timestamp">{formatTime(res.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherInbox;

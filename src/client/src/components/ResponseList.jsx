// src/components/ResponseList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import '../styles/ResponseList.css';
import axios from 'axios';
import { BASE_URL } from '../api/urls';

dayjs.extend(relativeTime);

// Get relative time from date string (e.g., "3 minutes ago")
function getRelativeTime(dateString) {
  return dayjs(dateString).fromNow();
}

const ResponseList = ({ responseList }) => {
  const navigate = useNavigate();

  // Mark feedback as read on the server
  const markFeedbackAsRead = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/api/feedback/markRead`, {
        responseId: id
      });
      console.log("Marked feedback as read");
    } catch (error) {
      console.error("Failed to mark feedback as read:", error);
    }
  };

  // Navigate to the response detail and feedback view
  // Mark Feedback as read
  const clickResponse = (id) => {
    navigate('/student-response/' + id);
    markFeedbackAsRead(id);
  };

  return (
    <div className="response-list">
      <h3>Your Responses</h3>
      {[...responseList]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((res) => (
          <div key={res.id} className="response-card" onClick={() => clickResponse(res.id)}>
            <div>
              <p className="response-text">{res.text}</p>
              <p className="timestamp">{getRelativeTime(res.createdAt)}</p>
            </div>
            {res.hasUnreadFeedback && <div className="red-dot" />}
          </div>
        ))}
    </div>
  );
};

export default ResponseList;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../styles/ResponseDetail.css";
import avatar from '../assets/avatar.svg';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import EditResponseModal from '../components/EditResponseModal';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../api/urls"; 
import { FaHeart, FaRegHeart } from 'react-icons/fa';

// Extend dayjs plugins to support isToday and isYesterday functionality
dayjs.extend(isToday);
dayjs.extend(isYesterday);

// Format time display (Today, Yesterday or full date)
function formatTime(dateString) {
  const date = dayjs(dateString);

  if (date.isToday()) {
    return `Today ${date.format('h:mm A')}`;
  } else if (date.isYesterday()) {
    return `Yesterday ${date.format('h:mm A')}`;
  } else {
    return date.format('MMMM D, YYYY h:mm A');
  }
}

const ResponseInfo = () => {
  const { id } = useParams(); // Get response id from the url
  const navigate = useNavigate();

  // State definitions
  const [responseData, setResponseData] = useState({});
  const [feedbackList, setFeedbackList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResId, setEditingResId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch response data
  const getResponse = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/SilentResponse/${id}`);
      setResponseData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error('Fail to get response: ', error);
    }
  }, [id]);

  // Fetch feedback list
  const fetchFeedbackList = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/feedback/${id}`);
      setFeedbackList(res.data);
      console.log(res.data);
    } catch (error) {
      console.error('Fail to get responses: ', error);
    }
  }, [id]);

  // Initial load & polling every 5 seconds for updates
  useEffect(() => {
    setIsLoading(true);
    getResponse();
    fetchFeedbackList().finally(() => setIsLoading(false));
    // Polling feedback every 5 seconds
    const interval = setInterval(() => {
      getResponse();
      fetchFeedbackList();
    }, 3000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [getResponse, fetchFeedbackList]);

  // Save edited response
  const handleSaveEdit = async () => {
    // Check if the input is empty
    if (!editedContent.trim()) {
      alert('Response cannot be empty.');
      return;
    }

    // Limit the input to 300 characters
    if (editedContent.length > 300) {
      alert('Response is too long. Please limit to 300 characters.');
      return;
    }

    try {
      const res = await axios.put(`${BASE_URL}/SilentResponse/`, {
        id: editingResId,
        text: editedContent
      });
      console.log(res);
      setIsModalOpen(false);
      getResponse();
    } catch (err) {
      console.error("Failed to edit response:", err);
    }
  };

  // Delete Response
  const handleDelete = async (responseId) => {
    const confirmed = window.confirm("Are you sure you want to delete this response?");
    if (!confirmed) return;
    try {
      const res = await axios.delete(`${BASE_URL}/SilentResponse/${responseId}`);
      console.log(res);
      navigate('/submit-response/');
    } catch (err) {
      console.error("Failed to delete response:", err);
      alert("Failed to delete the response. Please try again later.");
    }
  };

  const handleLike = async (feedbackId) => {
    try {
      const feedback = feedbackList.find(fb => fb.id === feedbackId);
      const currentLike = feedback?.like === true;
      const payload = { like: !currentLike };
      await axios.post(`${BASE_URL}/api/feedback/react/${feedbackId}`, payload);
      fetchFeedbackList();
    } catch (error) {
      console.error('Failed to react to feedback:', error);
      alert("Failed to submit your reaction. Please try again later.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="content">
      {/* User block */}
      <div className="card">
        <div className="user-info">
          <img src={avatar} alt='avatar' />
          <div>
            <div className="username">{responseData.Student?.name}</div>
            <div className="timestamp">{formatTime(responseData.createdAt)}</div>
          </div>
        </div>
        <div className="message">{responseData.text}</div>
        <div className="edited-container">
          {responseData.isEdited && (
            <span className="response-edited-label"> (Edited) </span>
          )}
        </div>
        
      </div>

      {/* Edit/Delete buttons */}
      <div className="card-buttons">
        <button className="edit-btn" 
          onClick={() => {
            if (feedbackList.length > 0) {
              alert("You can't edit this response because feedback has already been provided.");
              return;
            }
            setIsModalOpen(true);
            setEditingResId(responseData.id);
            setEditedContent(responseData.text);
          }}
          title={feedbackList.length > 0 ? "Editing is disabled after feedback is received" : ""}
        >
          Edit
        </button>
        <button className="delete-btn" onClick={() => handleDelete(responseData.id)}>Delete</button>
      </div>
      {/* Edit response modal */}
      <EditResponseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEdit}
        value={editedContent}
        setValue={setEditedContent}
      />

      {/* Feedback block */}
      <div className="card">
        <h2 className="feedback-title">Feedback</h2>
        {feedbackList.map((feedback) => (
          <div key={feedback.id}>
            {feedback.type === "emoji" && (
              <>
                <div className="feedback-header">
                  <p className="label">You got an reaction:</p>
                  <div className="timestamp">
                    {formatTime(feedback.createdAt)}
                  </div>
                </div>
                <div className="reaction">{feedback.content}</div>
              </>
            )}
            {feedback.type === "text" && (
              <>
                <div className="feedback-header">
                  <p className="label">You got a comment:</p>
                  <div className="timestamp">{formatTime(feedback.createdAt)}</div>
                </div>
                <div className="comment-box">{feedback.content}</div>
                {/* heart button reaction */}
                <div className="like-button">
                  <button
                    className="like-btn"
                    onClick={() => handleLike(feedback.id)}
                    aria-label={feedback.like ? "Unlike" : "Like"}
                  >
                    {feedback.like ? <FaHeart color="red" /> : <FaRegHeart />}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>      
    </div>
  );
};

export default ResponseInfo;

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import avatar from "../assets/avatar.svg";
import emoji_button from "../assets/🦆 icon _face happy_.svg";
import text_button from "../assets/🦆 icon _message writing_.svg";
import EmojiPicker from "../components/EmojiPicker";
import TextFeedback from "../components/TextFeedback";
import { formatTime } from "../utils/formatTime";
import { BASE_URL } from "../api/urls";
import { FaHeart } from "react-icons/fa";

import "../styles/Feedback.css";
import "../styles/ResponseDetail.css";

const SubmitFeedback = () => {
  const { id } = useParams();
  const responseId = id;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [fetchedFeedbackList, setFetchedFeedbackList] = useState([]);

  const [showDelete, setShowDelete] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const reactionRef = useRef(null);

  const refreshFeedbackList = useCallback(() => {
    if (!responseId) return;
    axios
      .get(`${BASE_URL}/api/feedback/${responseId}`)
      .then((res) => setFetchedFeedbackList(res.data))
      .catch((err) => console.error("Error fetching feedback:", err));
  }, [responseId]);

  useEffect(() => {
    if (!responseId) return;
    axios
      .get(`${BASE_URL}/SilentResponse/${responseId}`)
      .then((res) => setResponseData(res.data))
      .catch((err) => console.error("Error fetching response:", err));
  }, [responseId]);

  useEffect(() => {
    refreshFeedbackList();
    const interval = setInterval(() => {
      refreshFeedbackList();
    }, 3000);
  
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [refreshFeedbackList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        setShowDelete(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/feedback/delete/${id}`);
      refreshFeedbackList();
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
    setShowDelete(false);
  };

  const handleEditFeedback = async (id, newContent) => {
    try {
      await axios.put(`${BASE_URL}/api/feedback/edit/${id}`, {
        content: newContent,
      });
      refreshFeedbackList();
    } catch (err) {
      console.error("Error editing feedback:", err);
    }
    setEditingId(null);
  };

  const renderHeartStatus = (like) => {
    if (like) return <FaHeart color="red" />;
    return null;
  };

  const emojiFeedbacks = fetchedFeedbackList.filter((fb) => fb.type === "emoji");
  const textFeedbacks = fetchedFeedbackList.filter((fb) => fb.type === "text");
  const latestEmoji = emojiFeedbacks.at(-1) || null;

  const displayName = responseData?.isAnonymous
    ? "Anonymous"
    : responseData?.Student?.name || "—";
  const timeString = responseData?.createdAt;
  const textContent = responseData?.text;

  if (!responseData) return <p>Loading...</p>;

  return (
    <section className="content">
      <div className="card">
        <div className="user-info">
          <img src={avatar} alt="avatar" />
          <div>
            <div className="username">{displayName}</div>
            <div className="timestamp">{formatTime(timeString)}</div>
          </div>
        </div>
        <div className="message">{textContent}</div>
      </div>

      <div className="feedback-selection">
        <button
          className="emoji-button"
          onClick={() => {
            setShowEmojiPicker((prev) => !prev);
            setShowTextInput(false);
          }}
        >
          <img src={emoji_button} alt="emoji" />
        </button>
        <button
          className="text-button"
          onClick={() => {
            setShowTextInput((prev) => !prev);
            setShowEmojiPicker(false);
          }}
        >
          <img src={text_button} alt="text reply" />
        </button>
      </div>

      {showEmojiPicker && (
        <EmojiPicker
          responseId={responseId}
          onSelect={() => {
            setShowEmojiPicker(false);
            refreshFeedbackList();
          }}
        />
      )}
      {showTextInput && (
        <TextFeedback
          responseId={responseId}
          onSubmit={() => {
            setShowTextInput(false);
            refreshFeedbackList();
          }}
        />
      )}

      {(latestEmoji || textFeedbacks.length > 0) && (
        <div className="card">
          <h2 className="feedback-title">Feedback</h2>

          {/* Emoji feedback */}
          {latestEmoji && (
            <>
              <div className="feedback-header">
                <p className="label">You sent a reaction:</p>
                <div className="timestamp">{formatTime(latestEmoji.createdAt)}</div>
              </div>
              <div
                ref={reactionRef}
                className={`reaction ${showDelete ? "active" : ""}`}
                onClick={() => setShowDelete(true)}
              >
                <span>{latestEmoji.content}</span>
                {showDelete && (
                  <span
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFeedback(latestEmoji.id);
                    }}
                  >
                    ❌
                  </span>
                )}
              </div>
            </>
          )}

          {/* Text feedback list */}
          {textFeedbacks.map((feedback) => (
            <div className="text-feedback-block" key={feedback.id}>
              <div className="feedback-header">
                <p className="label">You left a comment:</p>
                <div className="timestamp">{formatTime(feedback.createdAt)}</div>
              </div>
              <div className="comment-box">
                <div className="comment-content">
                  {feedback.content}
                  {feedback.isEdited && (
                    <span className="edited-label"> (Edited)</span>
                  )}
                </div>
                <div className="inline-actions">
                  <div className="thumb-status">{renderHeartStatus(feedback.like)}</div>
                  <button onClick={() => {
                    setEditingId(feedback.id);
                    setEditContent(feedback.content);
                  }}>Edit</button>
                  <button
                    onClick={() => {
                      const confirmed = window.confirm("Are you sure you want to delete this feedback?");
                      if (confirmed) {
                        handleDeleteFeedback(feedback.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingId === feedback.id && (
                <div
                  className="modal-backdrop"
                  onClick={() => {
                    setEditContent(feedback.content);
                    setEditingId(null);
                  }}
                >
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h3 className="modal-title">Edit your feedback</h3>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="modal-textarea"
                    />
                    <div className="modal-actions">
                      <button
                        onClick={() => {
                          setEditContent(feedback.content);
                          setEditingId(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button onClick={() => handleEditFeedback(feedback.id, editContent)}>Save</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SubmitFeedback;

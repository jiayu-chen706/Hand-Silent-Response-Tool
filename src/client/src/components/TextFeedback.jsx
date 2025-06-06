import React, { useState } from "react";
import "../styles/TextFeedback.css";
import useSendFeedback from "../hooks/useSendFeedback";

// Text feedback input component for teachers
export default function TextFeedback({ onSubmit, responseId }) {
  // User input state
  const [feedbackText, setFeedbackText] = useState("");
  const { sendFeedback } = useSendFeedback();

  // Handle submit logic
  const handleSubmit = async () => {
    const trimmedFeedback = feedbackText.trim();

    // Do not send empty text
    if (!trimmedFeedback) return;

    // Validate responseId
    if (!responseId || isNaN(Number(responseId))) {
      console.warn("Invalid responseId:", responseId);
      return;
    }

    try {
      // Send text feedback to backend
      await sendFeedback("text", trimmedFeedback, responseId);

      // Notify parent component (e.g., to refresh list)
      onSubmit(trimmedFeedback);
      console.log("Text feedback sent:", trimmedFeedback);

      // Clear input after sending
      setFeedbackText("");
    } catch (error) {
      console.error("Failed to send text feedback:", error);
    }
  };

  return (
    <div className="text-feedback-container">
      <p className="comment-title">Provide feedback</p>

      {/* Text input area */}
      <textarea
        className="feedback-textarea"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Type your comment here..."
        rows={4}
      />

      {/* Submit button */}
      <div className="submit-wrapper">
        <button className="submit-button" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  );
}

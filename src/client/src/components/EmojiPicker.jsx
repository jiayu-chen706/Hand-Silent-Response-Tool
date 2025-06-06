import React from "react";
import "../styles/EmojiPicker.css";
import useSendFeedback from "../hooks/useSendFeedback.js";

// Define available emojis for feedback
const emojis = ["✅", "👍", "❤️", "😄", "👏"];

export default function EmojiPicker({ onSelect, responseId }) {
  // Custom hook for sending feedback to backend
  const { sendFeedback } = useSendFeedback();

  // Handle emoji selection
  const handleSelect = async (emoji) => {
    // Validate emoji
    if (!emojis.includes(emoji)) {
      console.warn("Invalid emoji selected:", emoji);
      return;
    }

    // Validate responseId
    if (!responseId || isNaN(Number(responseId))) {
      console.warn("Invalid or missing responseId:", responseId);
      return;
    }

    try {
      // Send emoji feedback with type 'emoji'
      await sendFeedback("emoji", emoji, responseId);
      // Notify parent component after submission
      onSelect(emoji);
      console.log("Emoji feedback sent:", emoji);
    } catch (error) {
      console.error("Failed to send emoji feedback:", error);
    }
  };

  return (
    <div className="emoji-picker-container">
      <p className="emoji-title">Provide feedback</p>
      <div className="emoji-picker">
        {emojis.map((emoji, index) => (
          <span
            key={index}
            className="emoji-option"
            // onClick={() => onSelect(emoji)}
            onClick={() => handleSelect(emoji)}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}

import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SubmitResponse.css';
import { BASE_URL } from "../api/urls"; 
import ResponseList from '../components/ResponseList';

const SubmitResponse = () => {
  const [response, setResponse] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [responseList, setResponseList] = useState([]);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // Dummy student and class IDs; in real use, these would be dynamic
  const studentId = localStorage.getItem("studentId"); 
  const classId = localStorage.getItem("classId"); 

  //  Submit a new response to the server
  const handleSubmitResponse = async () => {
    const currentTime = Date.now();
    const cooldownPeriod = 30000; // set cool down period to 30s

    if (currentTime - lastSubmitTime < cooldownPeriod) {
      alert('Please wait 30s before submitting again.');
      return;
    }

    const trimmedResponse = response.trim();
    if (!trimmedResponse) {
      alert('Response cannot be empty.');
      return;
    }

    if (trimmedResponse.length > 300) {
      alert('Response is too long. Please limit to 300 characters.');
      return;
    }  

    try {
      const res = await axios.post(`${BASE_URL}/SilentResponse/byStudent`, {
        studentId: studentId,
        classId: classId,
        isAnonymous: isAnonymous,
        text: response
      });
      console.log(res);
      // Clear input and refresh the response list and last submit time
      setResponse('');
      setIsAnonymous(false);
      setLastSubmitTime(currentTime); 
      fetchResponseList();
    } catch (error) {
      console.error('Fail to submit response: ', error);
    }
  };

  // Fetch feedback list for a specific response and check for unread feedback
  const fetchFeedbackStatus = async (responseId) => {
    try {
      const feedbackRes = await axios.get(`${BASE_URL}/api/feedback/${responseId}`);
      const feedbackList = feedbackRes.data;
      const hasUnread = feedbackList.some(feedback => feedback.isUnread === true);
      return hasUnread;
    } catch (error) {
      console.error(`Fail to get feedback for response ${responseId}:`, error);
      return false;
    }
  };

  // Fetch the list of student responses along with unread feedback status
  const fetchResponseList = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/SilentResponse/byStudent/${studentId}`);
      let responseList = res.data;
  
      const updatedResponses = await Promise.all(
        responseList.map(async (response) => {
          const hasUnread = await fetchFeedbackStatus(response.id);
          return {
            ...response,
            hasUnreadFeedback: hasUnread
          };
        })
      );
  
      setResponseList(updatedResponses);
    } catch (error) {
      console.error('Fail to get responses: ', error);
    }
  };
  
  // Fetch responses on component mount and set interval for polling every 5 seconds
  useEffect(() => { 
    fetchResponseList();
    const interval = setInterval(() => {
      fetchResponseList();
    }, 3000);
  
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Translate response with other language to English
  const translateText = async (originalText) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/translate`, {
        text: originalText,
      });
      console.log(res.data);
      setResponse(res.data);
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Translation failed");
    }
  };


  return (
    <div className="response-container">
      {/* Response Submission Section */}
      <div className="submit-field">
        {/* Label for the textarea input */}
        <label className="response-label">Write Your Response</label>
        {/* Textarea for writing the response */}
        <textarea
          className="response-input"
          placeholder="Type your response here..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        
        <div className="options-row">
          {/* Checkbox to toggle anonymous response */}
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous">Anonymously</label>
          </div>

          <button 
            className="translate-button" 
            onClick={() => translateText(response)}
          >
            Translate
          </button>
        </div>
        

        {/* Button to submit the response */}
        <button className="submit-response-btn" onClick={handleSubmitResponse}>
          Submit
        </button>
      </div>

      {/* Response List Section */}
      <ResponseList
        responseList={responseList}
      />
    </div>
  )
}

export default SubmitResponse;
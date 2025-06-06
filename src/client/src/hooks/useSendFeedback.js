import { useCallback } from "react";
import { BASE_URL } from "../api/urls"; 
import authAxios from '../utils/authAxios';

export default function useSendFeedback() {
  const sendFeedback = useCallback(async (type, content, responseId) => {
    try {
      const res = await authAxios.post(`${BASE_URL}/api/feedback`, {
        type,
        content,
        responseId
      });
      console.log('Feedback sent successfully:', res.data);
      return res.data;
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw error; 
    }
  }, []);

  return { sendFeedback };
}

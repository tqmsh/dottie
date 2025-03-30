import { apiClient } from "../core/apiClient";
import { Assessment } from "./types";

/**
 * Send assessment results from frontend context, generates a new assessmentId
 * @endpoint /api/assessment/send (POST)
 */
export const postSend = async (assessmentData: Omit<Assessment, 'id'>): Promise<Assessment> => {
  try {
    const response = await apiClient.post('/api/assessment/send', assessmentData);
    return response.data;
  } catch (error) {
    console.error('Failed to send assessment:', error);
    throw error;
  }
};

export default postSend; 
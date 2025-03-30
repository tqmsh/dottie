import { apiClient } from "../core/apiClient";
import { ChatResponse } from "./types";

/**
 * Send a message to the AI (Gemini API) and get a response
 * @endpoint /api/chat/send (POST)
 */
export const sendMessage = async (message: string, conversationId?: string): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post('/api/chat/send', { 
      message,
      conversationId
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send chat message:', error);
    throw error;
  }
};

export default sendMessage; 
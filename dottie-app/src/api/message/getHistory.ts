import { apiClient } from "../core/apiClient";
import { Conversation } from "./types";

/**
 * Get chat history for the authenticated user, returns all conversations as a list
 * @endpoint /api/chat/history (GET)
 */
export const getHistory = async (): Promise<{ conversations: Conversation[] }> => {
  try {
    const response = await apiClient.get('/api/chat/history');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    throw error;
  }
};

export default getHistory; 
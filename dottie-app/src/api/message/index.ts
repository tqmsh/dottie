import apiClient from "../core/apiClient";

export interface ApiMessage {
  message: string;
  timestamp: string;
}

export const messageApi = {
  /**
   * Get a test message from the API
   */
  getApiMessage: async (): Promise<ApiMessage> => {
    try {
      const response = await apiClient.get('/api/message');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch API message:', error);
      throw error;
    }
  },
  
  /**
   * Send a message to the API
   */
  sendMessage: async (message: string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.post('/api/message', { message });
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
};

export default messageApi; 
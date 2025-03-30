import apiClient from './apiClient';

// DB connection utilities
export const checkDbConnection = async () => {
  try {
    const response = await apiClient.get('/api/db');
    return response.data;
  } catch (error) {
    console.error('Database connection check failed:', error);
    throw error;
  }
};

export const fetchUserData = async (userId: string) => {
  try {
    const response = await apiClient.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user data for ID ${userId}:`, error);
    throw error;
  }
};

export default {
  checkDbConnection,
  fetchUserData
}; 
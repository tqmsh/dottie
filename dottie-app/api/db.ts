import axios from 'axios';

// Check DB connection - for testing database status
export const checkDbConnection = async () => {
  try {
    const response = await axios.get('/api/db');
    return response.data;
  } catch (error) {
    console.error('Error checking DB connection:', error);
    throw error;
  }
};

// Example of fetching data from the database
export const fetchUserData = async (userId: string) => {
  try {
    const response = await axios.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user data for ID ${userId}:`, error);
    throw error;
  }
}; 
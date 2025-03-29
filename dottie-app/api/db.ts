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

// Fetch current user data using the /me endpoint
export const fetchUserData = async () => {
  try {
    const response = await axios.get('/api/user/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}; 
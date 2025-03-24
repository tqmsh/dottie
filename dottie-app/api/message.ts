import axios from 'axios';

// Get API message - for testing connection to backend
export const getApiMessage = async () => {
  try {
    const response = await axios.get('/api/message');
    return response.data;
  } catch (error) {
    console.error('Error fetching API message:', error);
    throw error;
  }
};

// Example usage in components:
// import { getApiMessage } from '@/app/api/message';
// 
// const fetchMessage = async () => {
//   try {
//     const data = await getApiMessage();
//     setMessage(data.message);
//   } catch (error) {
//     setError('Failed to fetch message');
//   }
// }; 
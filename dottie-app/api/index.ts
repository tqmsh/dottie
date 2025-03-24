import apiService from './apiService';
import { getApiMessage } from './message';
import { checkDbConnection, fetchUserData } from './db';

// Re-export all API functions
export {
  apiService,
  getApiMessage,
  checkDbConnection,
  fetchUserData
};

// Default export for convenience
export default {
  apiService,
  getApiMessage,
  checkDbConnection,
  fetchUserData
}; 
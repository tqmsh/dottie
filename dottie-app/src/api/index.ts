import apiClient from './core/apiClient';
import { isSuccess, isClientError, isServerError } from './core/apiClient';
import { checkDbConnection, fetchUserData } from './core/db';

import { authApi } from './auth';
import { type User, type LoginInput, type SignupInput } from './auth/types';

import { assessmentApi, type Assessment } from './assessment';
import { messageApi, type ApiMessage } from './message';
import { userApi, type UserProfile } from './user';

// Export all API modules
export {
  apiClient,
  isSuccess,
  isClientError,
  isServerError,
  checkDbConnection,
  fetchUserData,
  
  // Auth exports
  authApi,
  User,
  LoginInput,
  SignupInput,
  
  // Assessment exports
  assessmentApi,
  Assessment,
  
  // Message exports
  messageApi,
  ApiMessage,
  
  // User exports
  userApi,
  UserProfile
};

// Default export for convenience
export default {
  apiClient,
  auth: authApi,
  assessment: assessmentApi,
  message: messageApi,
  user: userApi,
  db: { checkDbConnection, fetchUserData }
}; 
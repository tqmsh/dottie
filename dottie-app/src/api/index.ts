import apiClient from './core/apiClient';
import { isSuccess, isClientError, isServerError } from './core/apiClient';
import { checkDbConnection, fetchUserData } from './core/db';

import { authApi, login, signup, logout, refreshToken } from './auth';
import { type User, type LoginInput, type SignupInput, type AuthResponse } from './auth/utils/types';

import { assessmentApi, type Assessment } from './assessment';
import { chatApi, type ApiMessage, type Conversation, type ChatResponse } from './message';
import { userApi, type UserProfile, type PasswordResetRequest, type PasswordUpdateRequest } from './user';

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
  login,
  signup,
  logout,
  refreshToken,
  User,
  LoginInput,
  SignupInput,
  AuthResponse,
  
  // Assessment exports
  assessmentApi,
  Assessment,
  
  // Chat exports
  chatApi,
  ApiMessage,
  Conversation,
  ChatResponse,
  
  // User exports
  userApi,
  UserProfile,
  PasswordResetRequest,
  PasswordUpdateRequest
};

// Default export for convenience
export default {
  apiClient,
  auth: authApi,
  assessment: assessmentApi,
  chat: chatApi,
  user: userApi,
  db: { checkDbConnection, fetchUserData }
}; 
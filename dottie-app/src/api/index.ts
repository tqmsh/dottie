import apiClient from './core/apiClient';
import { isSuccess, isClientError, isServerError } from './core/apiClient';
import { checkDbConnection, fetchUserData } from './core/db';

// Auth exports
import { authApi, login, signup, logout, refreshToken } from './auth';
import { type User, type LoginInput, type SignupInput, type AuthResponse } from './auth/types';

// User exports
import { 
  userApi, 
  getCurrentUser, 
  getUserById, 
  updateUser, 
  deleteUser,
  updatePassword,
  requestPasswordReset,
  completePasswordReset
} from './user';
import { type UserProfile, type PasswordUpdateRequest, type PasswordResetRequest } from './user/types';

// Assessment exports
import { 
  assessmentApi, 
  getList as listAssessments, 
  getById as getAssessmentById,
  sendAssessment,
  update as updateAssessment,
  deleteAssessment
} from './assessment';
import { type Assessment } from './assessment/types';

// Message/Chat exports
import { 
  chatApi, 
  sendMessage, 
  getHistory, 
  getConversation, 
  deleteConversation 
} from './message';
import { type ApiMessage, type Conversation, type ChatResponse } from './message/types';

// Export all API modules and types
export {
  // Core exports
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
  
  // User exports
  userApi,
  getCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
  updatePassword,
  requestPasswordReset,
  completePasswordReset,
  UserProfile,
  PasswordResetRequest,
  PasswordUpdateRequest,
  
  // Assessment exports
  assessmentApi,
  listAssessments,
  getAssessmentById,
  sendAssessment,
  updateAssessment,
  deleteAssessment,
  Assessment,
  
  // Chat exports
  chatApi,
  sendMessage,
  getHistory,
  getConversation,
  deleteConversation,
  ApiMessage,
  Conversation,
  ChatResponse
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
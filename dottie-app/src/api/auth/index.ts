import { apiClient } from "../core/apiClient";
import postLogin from "./postLogin";
import postSignup from "./postSignup";
import postLogout from "./postLogout";
import postRefreshToken from "./postRefreshToken";
import {
  LoginSchema,
  SignupSchema,
  AuthResponseSchema,
} from "./schemas";
import {
  LoginInput,
  SignupInput,
  User,
  AuthResponse,
  PasswordUpdateInput,
  PasswordResetRequestInput,
  PasswordResetCompletionInput
} from "./types";

// Re-export schemas and types
export * from "./schemas";
export * from "./types";

// Export apiClient for other modules to use
export { apiClient as api };

// Re-export auth endpoints
export {
  postLogin as login,
  postSignup as signup,
  postLogout as logout,
  postRefreshToken as refreshToken
};

// Auth API object for backward compatibility
export const authApi = {
  login: postLogin,
  signup: postSignup,
  logout: postLogout,
  refreshToken: postRefreshToken,
  
  // Methods defined in user API but kept here for backward compatibility
  getCurrentUser: async () => {
    throw new Error("getCurrentUser has been moved to userApi. Please update your imports.");
  },
  updatePassword: async () => {
    throw new Error("updatePassword has been moved to userApi. Please update your imports.");
  },
  requestPasswordReset: async () => {
    throw new Error("requestPasswordReset has been moved to userApi. Please update your imports.");
  },
  completePasswordReset: async () => {
    throw new Error("completePasswordReset has been moved to userApi. Please update your imports.");
  }
}; 
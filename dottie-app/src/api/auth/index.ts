import axios from "axios";
import apiClient from "../core/apiClient";
import { 
  AuthResponseSchema, 
  UserSchema 
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

// Auth API functions
export const authApi = {
  // Login
  login: async (credentials: LoginInput): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/login",
        credentials
      );
      const validatedData = AuthResponseSchema.parse(response.data);
      // Store auth tokens
      localStorage.setItem("auth_token", validatedData.token);
      localStorage.setItem("refresh_token", validatedData.refreshToken);
      localStorage.setItem("auth_user", JSON.stringify(validatedData.user));
      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error || "Login failed, please try again later");
      }
      throw error;
    }
  },

  // Signup
  signup: async (userData: SignupInput): Promise<User> => {
    try {
      const response = await apiClient.post<User>(
        "/api/auth/signup",
        userData
      );
      const validatedData = UserSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.error || "Signup failed, please try again later");
      }
      throw error;
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    // Just clear stored tokens without making API call
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("auth_user");
    // No API call needed - simulating successful logout
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get<User>('/api/user/me');
      const validatedData = UserSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Failed to get user data"
        );
      }
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const response = await apiClient.post<{ token: string }>(
        "/api/auth/refresh", 
        { refreshToken }
      );
      // Update stored token
      if (response.data.token) {
        localStorage.setItem("auth_token", response.data.token);
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Token refresh failed"
        );
      }
      throw error;
    }
  },

  // Update password
  updatePassword: async (userId: string, passwordData: PasswordUpdateInput): Promise<{ message: string }> => {
    try {
      const { currentPassword, newPassword } = passwordData;
      const response = await apiClient.post<{ message: string }>(
        `/api/user/pw/update/${userId}`,
        { currentPassword, newPassword }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Password update failed, please try again later"
        );
      }
      throw error;
    }
  },

  // Request password reset (forgot password)
  requestPasswordReset: async (emailData: PasswordResetRequestInput): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ message: string }>(
        `/api/user/pw/reset`,
        emailData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Password reset request failed, please try again later"
        );
      }
      throw error;
    }
  },

  // Complete password reset with token
  completePasswordReset: async (resetData: PasswordResetCompletionInput): Promise<{ message: string }> => {
    try {
      const { token, newPassword } = resetData;
      const response = await apiClient.post<{ message: string }>(
        `/api/user/pw/reset-complete`,
        { token, newPassword }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || "Password reset failed, please try again later"
        );
      }
      throw error;
    }
  },
};

// For convenience, also export api client
export { apiClient as api };

export default authApi; 
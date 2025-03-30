import apiClient from "../core/apiClient";
import { User } from "../auth/types";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get('/api/user/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await apiClient.put(`/api/user/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  },
  
  /**
   * Get user by ID (admin only)
   */
  getUserById: async (userId: string): Promise<User> => {
    try {
      const response = await apiClient.get(`/api/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user with ID ${userId}:`, error);
      throw error;
    }
  },
};

export default userApi; 
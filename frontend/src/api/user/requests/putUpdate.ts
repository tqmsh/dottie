import { apiClient } from "../../core/apiClient";
import { UserProfile } from "../utils/types";

/**
 * Update user profile
 * @endpoint /api/user/me (PUT)
 */
export const putUpdate = async (userData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await apiClient.put(`/api/user/me`, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

export default putUpdate; 
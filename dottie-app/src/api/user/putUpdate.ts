import { apiClient } from "../core/apiClient";
import { UserProfile } from "./types";

/**
 * Update user profile
 * @endpoint /api/user/:id (PUT)
 */
export const putUpdate = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await apiClient.put(`/api/user/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

export default putUpdate; 
import { apiClient } from "../../core/apiClient";
import { UserProfile } from "../utils/types";

/**
 * Update user profile
 * @endpoint /api/user/:id (PUT)
 */
export const putUpdate = async (id: string, userData: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await apiClient.put(`/api/user/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

export default putUpdate; 
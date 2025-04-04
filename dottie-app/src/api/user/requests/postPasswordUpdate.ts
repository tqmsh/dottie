import { apiClient } from "../../core/apiClient";
import { PasswordUpdateRequest } from "../utils/types";

/**
 * Update user password
 * @endpoint /api/user/password/update (POST)
 */
export const postPasswordUpdate = async (passwordData: PasswordUpdateRequest): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/user/password/update', passwordData);
    return response.data;
  } catch (error) {
    console.error('Failed to update password:', error);
    throw error;
  }
};

export default postPasswordUpdate; 
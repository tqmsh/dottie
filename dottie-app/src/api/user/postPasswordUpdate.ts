import axios from "axios";
import { apiClient } from "../core/apiClient";
import { PasswordUpdateInput } from "../auth/types";

/**
 * Update user password
 * @endpoint /api/user/pw/update (POST)
 */
export const postPasswordUpdate = async (userId: string, passwordData: PasswordUpdateInput): Promise<{ message: string }> => {
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
};

export default postPasswordUpdate; 
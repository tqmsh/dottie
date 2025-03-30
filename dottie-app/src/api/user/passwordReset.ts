import axios from "axios";
import { apiClient } from "../core/apiClient";
import { PasswordResetRequestInput, PasswordResetCompletionInput } from "../auth/types";

/**
 * Request password reset (forgot password)
 * @endpoint /api/user/pw/reset (POST)
 */
export const requestPasswordReset = async (emailData: PasswordResetRequestInput): Promise<{ message: string }> => {
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
};

/**
 * Complete password reset with token
 * @endpoint /api/user/pw/reset-complete (POST)
 */
export const completePasswordReset = async (resetData: PasswordResetCompletionInput): Promise<{ message: string }> => {
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
};

// Don't re-export what's already exported
export { 
  // requestPasswordReset, 
  // completePasswordReset 
}; 
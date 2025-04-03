import { apiClient } from "../../core/apiClient";
import { PasswordResetRequest, PasswordResetCompletion } from "../utils/types";

/**
 * Request password reset by email
 * @endpoint /api/user/pw/reset (POST)
 */
export const requestPasswordReset = async (emailData: PasswordResetRequest): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/user/pw/reset', emailData);
    return response.data;
  } catch (error) {
    console.error('Failed to request password reset:', error);
    throw error;
  }
};

/**
 * Complete password reset using token and new password
 * @endpoint /api/user/pw/reset-complete (POST)
 */
export const completePasswordReset = async (resetData: PasswordResetCompletion): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/user/pw/reset-complete', resetData);
    return response.data;
  } catch (error) {
    console.error('Failed to complete password reset:', error);
    throw error;
  }
}; 
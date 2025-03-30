import axios from "axios";
import { apiClient } from "../core/apiClient";
import { User } from "../auth/types";
import { UserSchema } from "./schemas";

/**
 * Get current user profile
 * @endpoint /api/user/me (GET)
 */
export const getCurrentUser = async (): Promise<User> => {
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
};

export default getCurrentUser; 
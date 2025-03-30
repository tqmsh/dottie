import axios from "axios";
import { apiClient } from "../core/apiClient";

/**
 * Logout user and invalidate token
 * @endpoint /api/auth/logout (POST)
 */
export const postLogout = async (): Promise<void> => {
  try {
    await apiClient.post("/api/auth/logout");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Logout failed");
    }
    throw error;
  }
};

export default postLogout;

 
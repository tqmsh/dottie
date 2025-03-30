import axios from "axios";
import { apiClient } from "../core/apiClient";

/**
 * Refresh auth token
 * @endpoint /auth/refresh (POST)
 */
export const postRefreshToken = async (): Promise<{ token: string }> => {
  try {
    const response = await apiClient.post<{ token: string }>("/auth/refresh");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Token refresh failed"
      );
    }
    throw error;
  }
};

export default postRefreshToken; 
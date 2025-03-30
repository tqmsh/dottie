import { apiClient } from "../core/apiClient";
import { User } from "../auth/types";

/**
 * Get user by ID
 * @endpoint /api/user/:id (GET)
 */
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user with ID ${userId}:`, error);
    throw error;
  }
};

export default getUserById; 
import { apiClient } from "@core/apiClient";
import { UserProfile } from "../../types";

/**
 * Get user by ID
 * @endpoint /api/user/:id (GET)
 */
export const getById = async (id: string): Promise<UserProfile> => {
  try {
    const response = await apiClient.get(`/api/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get user:', error);
    throw error;
  }
};

export default getById; 
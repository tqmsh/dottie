import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";
import { getUserData } from "../../../core/tokenManager";

/**
 * Get assessment by ID
 * @endpoint /api/assessment/:id (GET)
 */
export const getById = async (id: string): Promise<Assessment> => {
  try {
    // Get the user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      throw new Error('User ID not found. Please login again.');
    }
    
    // Need to add userId to URL for consistency with other endpoints
    const response = await apiClient.get(`/api/assessment/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get assessment:', error);
    throw error;
  }
};

export default getById; 
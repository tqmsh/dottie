import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";

/**
 * Get assessment by ID
 * @endpoint /api/assessment/:id (GET)
 */
export const getById = async (id: string): Promise<Assessment> => {
  try {
    const response = await apiClient.get(`/api/assessment/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get assessment:', error);
    throw error;
  }
};

export default getById; 
import { apiClient } from "../../core/apiClient";
import { Assessment } from "../utils/types";

/**
 * Get list of all assessments
 * @endpoint /api/assessment/ (GET)
 */
export const getList = async (): Promise<Assessment[]> => {
  try {
    const response = await apiClient.get('/api/assessment');
    return response.data;
  } catch (error) {
    console.error('Failed to get assessments:', error);
    throw error;
  }
};

export default getList; 
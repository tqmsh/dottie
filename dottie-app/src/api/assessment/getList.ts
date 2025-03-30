import { apiClient } from "../core/apiClient";
import { Assessment } from "./types";

/**
 * Get list of all assessments for the authenticated user
 * @endpoint /api/assessment/list (GET)
 */
export const getList = async (): Promise<Assessment[]> => {
  const response = await apiClient.get('/api/assessment/list');
  return response.data;
};

export default getList; 
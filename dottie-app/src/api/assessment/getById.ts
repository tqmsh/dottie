import { apiClient } from "../core/apiClient";
import { Assessment } from "./types";

/**
 * Get detailed view of a specific assessment by ID
 * @endpoint /api/assessment/:id (GET)
 */
export const getById = async (id: string): Promise<Assessment> => {
  const response = await apiClient.get(`/api/assessment/${id}`);
  return response.data;
};

export default getById; 
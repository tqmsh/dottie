import { apiClient } from "../core/apiClient";
import { Assessment } from "./types";

/**
 * Update a specific assessment by ID
 * @endpoint /api/assessment/:id (PUT)
 */
export const putUpdate = async (id: string, assessmentData: Partial<Assessment>): Promise<Assessment> => {
  try {
    const response = await apiClient.put(`/api/assessment/${id}`, assessmentData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update assessment with ID ${id}:`, error);
    throw error;
  }
};

export default putUpdate; 
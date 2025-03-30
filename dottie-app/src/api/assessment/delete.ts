import { apiClient } from "../core/apiClient";

/**
 * Delete a specific assessment by ID
 * @endpoint /api/assessment/:id (DELETE)
 */
export const deleteAssessment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/assessment/${id}`);
  } catch (error) {
    console.error(`Failed to delete assessment with ID ${id}:`, error);
    throw error;
  }
};

export default deleteAssessment; 
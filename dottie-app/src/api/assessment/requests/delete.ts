import { apiClient } from "../../core/apiClient";

/**
 * Delete assessment by ID
 * @endpoint /api/assessment/:id (DELETE)
 */
export const deleteAssessment = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/assessment/${id}`);
  } catch (error) {
    console.error('Failed to delete assessment:', error);
    throw error;
  }
};

export default deleteAssessment; 
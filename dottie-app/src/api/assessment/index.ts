import apiClient from "../core/apiClient";

export interface Assessment {
  id: string;
  date: string;
  pattern: string;
  age: string;
  cycleLength: string;
  periodDuration: string;
  flowHeaviness: string;
  painLevel: string;
  symptoms: {
    physical: string[];
    emotional: string[];
  };
  recommendations: Array<{
    title: string;
    description: string;
  }>;
}

export const assessmentApi = {
  list: async (): Promise<Assessment[]> => {
    try {
      const response = await apiClient.get('/api/assessment/list');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Assessment> => {
    try {
      const response = await apiClient.get(`/api/assessment/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch assessment with ID ${id}:`, error);
      throw error;
    }
  },
  
  create: async (assessmentData: Omit<Assessment, 'id'>): Promise<Assessment> => {
    try {
      const response = await apiClient.post('/api/assessment/create', assessmentData);
      return response.data;
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw error;
    }
  },
  
  update: async (id: string, assessmentData: Partial<Assessment>): Promise<Assessment> => {
    try {
      const response = await apiClient.put(`/api/assessment/${id}`, assessmentData);
      return response.data;
    } catch (error) {
      console.error(`Failed to update assessment with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/api/assessment/${id}`);
    } catch (error) {
      console.error(`Failed to delete assessment with ID ${id}:`, error);
      throw error;
    }
  }
};

export default assessmentApi; 
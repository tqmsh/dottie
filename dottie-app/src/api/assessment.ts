import { api } from "../../api/auth";

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
    const response = await api.get('/api/assessment/list');
    return response.data;
  },

  getById: async (id: string): Promise<Assessment> => {
    const response = await api.get(`/api/assessment/${id}`);
    return response.data;
  },
}; 
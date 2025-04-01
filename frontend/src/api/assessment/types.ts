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
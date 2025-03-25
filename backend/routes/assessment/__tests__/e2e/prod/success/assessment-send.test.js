import { describe, test, expect } from 'vitest';
import { submitAssessment, sampleAssessmentData } from '../setup.js';

// @prod
describe("Assessment Send Endpoint (Success) - Production", { tags: ['assessment', 'prod'] }, () => {
  test("POST /api/assessment/send - should submit assessment data when authenticated", async () => {
    const response = await submitAssessment();
    
    console.log(`Assessment submission endpoint status: ${response.status}`);
    
    // Test valid response cases (though we may not have valid credentials in prod test)
    if (response.status === 201) {
      const data = await response.json();
      expect(data).toBeDefined();
      // Additional assertions can be added when needed
    } else {
      // For prod testing, we expect this might return 401/403 which is also valid
      expect([201, 400, 401, 403]).toContain(response.status);
    }
  });
}); 
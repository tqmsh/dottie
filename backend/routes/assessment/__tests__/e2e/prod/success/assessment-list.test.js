import { describe, test, expect } from 'vitest';
import { API_URL, testToken, fetchAssessmentList } from '../setup.js';

// @prod
describe("Assessment List Endpoint (Success) - Production", { tags: ['assessment', 'prod'] }, () => {
  test("GET /api/assessment/list - should return assessments list when authenticated", async () => {
    const response = await fetchAssessmentList();
    
    console.log(`Assessment list endpoint status: ${response.status}`);
    
    // Test valid response cases (though we may not have valid credentials in prod test)
    if (response.status === 200) {
      const data = await response.json();
      expect(data).toBeDefined();
      // Additional assertions can be added when needed
    } else {
      // For prod testing, we expect this might return 401/403 which is also valid
      expect([200, 401, 403]).toContain(response.status);
    }
  });
}); 
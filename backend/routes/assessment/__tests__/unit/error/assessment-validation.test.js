// @ts-check
import { describe, test, expect } from 'vitest';
import { validateAssessmentData } from '../../../validators/index.js';

describe('Assessment Validation - Error Cases', () => {
  test('should reject assessment without userId', () => {
    const invalidAssessment = {
      // Missing userId
      assessmentData: {
        age: "18_24",
        cycleLength: "26_30"
      }
    };
    
    const result = validateAssessmentData(invalidAssessment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('userId is required');
  });
  
  test('should reject assessment without required assessmentData fields', () => {
    const invalidAssessment = {
      userId: 'test-user-id',
      assessmentData: {
        // Missing required fields like age or cycleLength
        flowHeaviness: "moderate"
      }
    };
    
    const result = validateAssessmentData(invalidAssessment);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  
  test('should reject assessment with invalid field values', () => {
    const invalidAssessment = {
      userId: 'test-user-id',
      assessmentData: {
        age: "invalid_age_range", // Invalid value
        cycleLength: "26_30"
      }
    };
    
    const result = validateAssessmentData(invalidAssessment);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid age value');
  });
}); 
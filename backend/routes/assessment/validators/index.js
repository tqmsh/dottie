/**
 * Validates assessment data
 * @param {Object} assessment - The assessment data to validate
 * @returns {Object} - Object with isValid flag and errors array
 */
export function validateAssessmentData(assessment) {
  const errors = [];
  
  // Check for required fields
  if (!assessment.userId) {
    errors.push('userId is required');
  }
  
  if (!assessment.assessmentData) {
    errors.push('assessmentData is required');
    return { isValid: errors.length === 0, errors };
  }
  
  const { assessmentData } = assessment;
  
  // Validate required assessment fields
  if (!assessmentData.age) {
    errors.push('age is required');
  } else if (!isValidAge(assessmentData.age)) {
    errors.push('Invalid age value');
  }
  
  if (!assessmentData.cycleLength) {
    errors.push('cycleLength is required');
  } else if (!isValidCycleLength(assessmentData.cycleLength)) {
    errors.push('Invalid cycleLength value');
  }
  
  // Validate optional fields if they exist
  if (assessmentData.periodDuration && !isValidPeriodDuration(assessmentData.periodDuration)) {
    errors.push('Invalid periodDuration value');
  }
  
  if (assessmentData.flowHeaviness && !isValidFlowHeaviness(assessmentData.flowHeaviness)) {
    errors.push('Invalid flowHeaviness value');
  }
  
  if (assessmentData.painLevel && !isValidPainLevel(assessmentData.painLevel)) {
    errors.push('Invalid painLevel value');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper validation functions
function isValidAge(age) {
  const validAges = ['under_18', '18_24', '25_29', '30_34', '35_39', '40_44', '45_plus'];
  return validAges.includes(age);
}

function isValidCycleLength(cycleLength) {
  const validCycleLengths = ['less_than_21', '21_25', '26_30', '31_35', '36_40', 'more_than_40', 'irregular'];
  return validCycleLengths.includes(cycleLength);
}

function isValidPeriodDuration(duration) {
  const validDurations = ['1_3', '4_5', '6_7', 'more_than_7'];
  return validDurations.includes(duration);
}

function isValidFlowHeaviness(flow) {
  const validFlows = ['light', 'moderate', 'heavy', 'very_heavy'];
  return validFlows.includes(flow);
}

function isValidPainLevel(pain) {
  const validPainLevels = ['none', 'mild', 'moderate', 'severe'];
  return validPainLevels.includes(pain);
} 
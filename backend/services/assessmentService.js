/**
 * Assessment Service
 * Contains logic for question retrieval and assessment analysis
 */

// Assessment questions data
const questions = {
  1: {
    id: 1,
    text: "How often do you experience stress related to your work?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"],
    progress: "16%"
  },
  2: {
    id: 2,
    text: "How many hours do you sleep on average per night?",
    options: ["Less than 5", "5-6", "7-8", "More than 8"],
    progress: "33%"
  },
  3: {
    id: 3,
    text: "How would you rate your overall energy level?",
    options: ["Very Low", "Low", "Moderate", "High", "Very High"],
    progress: "50%"
  },
  4: {
    id: 4,
    text: "How often do you engage in physical exercise?",
    options: ["Never", "1-2 times per week", "3-4 times per week", "5+ times per week"],
    progress: "67%"
  },
  5: {
    id: 5,
    text: "How would you rate your current diet?",
    options: ["Poor", "Fair", "Good", "Excellent"],
    progress: "83%"
  },
  6: {
    id: 6,
    text: "How often do you practice mindfulness or meditation?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
    progress: "100%"
  }
};

/**
 * Get a question by its ID
 * @param {number} id - The question ID
 * @returns {Object} The question object or null if not found
 */
export const getQuestionById = (id) => {
  return questions[id] || null;
};

/**
 * Analyze the assessment results based on answers
 * @param {Object} answers - The answers provided by the user
 * @returns {Object} Analysis results
 */
export const analyzeAssessment = (answers) => {
  // Simple scoring mechanism
  let wellnessScore = 0;
  let maxScore = 0;
  
  // Count total answers
  const answeredQuestions = Object.keys(answers).length;
  
  // If no questions were answered, return default results
  if (answeredQuestions === 0) {
    return {
      wellnessScore: 0,
      recommendations: ["Complete the assessment to get personalized recommendations."]
    };
  }
  
  // Calculate score based on answers
  // This is a simple algorithm that can be enhanced
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questions[questionId];
    if (!question) return;
    
    const optionIndex = question.options.indexOf(answer);
    if (optionIndex === -1) return;
    
    // For questions where higher is better (energy, exercise, diet, mindfulness)
    if ([3, 4, 5, 6].includes(parseInt(questionId))) {
      wellnessScore += optionIndex + 1;
      maxScore += question.options.length;
    } 
    // For questions where lower is better (stress)
    else if (parseInt(questionId) === 1) {
      wellnessScore += question.options.length - optionIndex;
      maxScore += question.options.length;
    }
    // For sleep, optimal is 7-8 hours
    else if (parseInt(questionId) === 2) {
      if (answer === "7-8") {
        wellnessScore += question.options.length;
      } else if (answer === "5-6" || answer === "More than 8") {
        wellnessScore += question.options.length - 1;
      } else {
        wellnessScore += 1;
      }
      maxScore += question.options.length;
    }
  });
  
  // Calculate percentage score
  const percentageScore = Math.round((wellnessScore / maxScore) * 100);
  
  // Generate recommendations based on score
  let recommendations = [];
  
  if (percentageScore < 40) {
    recommendations = [
      "Consider consulting a healthcare professional about your wellness routine.",
      "Start small with simple wellness practices like short walks or meditation.",
      "Focus on improving your sleep quality as a priority."
    ];
  } else if (percentageScore < 70) {
    recommendations = [
      "You're on the right track. Consider adding more structure to your wellness routine.",
      "Try incorporating more regular physical activity into your schedule.",
      "Consider mindfulness practices to help manage stress."
    ];
  } else {
    recommendations = [
      "Excellent job maintaining your wellness! Keep up the good work.",
      "Consider sharing your wellness practices with others who might benefit.",
      "Continue monitoring your wellness and adjust as needed."
    ];
  }
  
  return {
    wellnessScore: percentageScore,
    recommendations
  };
}; 
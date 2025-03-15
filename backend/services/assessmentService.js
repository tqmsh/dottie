// Questions data structure
const questions = {
  1: {
    id: 1,
    text: "What is your age?",
    subtitle: "This helps us provide appropriate insights and recommendations",
    options: [
      { id: "under_12", text: "Under 12" },
      { id: "12_14", text: "12-14 years" },
      { id: "15_17", text: "15-17 years" },
      { id: "18_24", text: "18-24 years" },
      { id: "over_24", text: "Over 24 years" },
    ],
    info: "We provide different resources and insights based on your age. For those under 18, we include educational content and resources for discussing menstrual health with parents or guardians.",
    progress: "16%",
  },
  2: {
    id: 2,
    text: "How long is your menstrual cycle?",
    subtitle:
      "Count from the first day of one period to the first day of the next period",
    options: [
      { id: "21_25", text: "21-25 days", description: "Shorter than average" },
      { id: "26_30", text: "26-30 days", description: "Average length" },
      { id: "31_35", text: "31-35 days", description: "Longer than average" },
      { id: "36_40", text: "36-40 days", description: "Extended cycle" },
      {
        id: "irregular",
        text: "Irregular",
        description: "Varies by more than 7 days",
      },
      {
        id: "not_sure",
        text: "I'm not sure",
        description: "Need help tracking",
      },
    ],
    info: "A typical menstrual cycle can range from 21 to 35 days. Cycles outside this range or that vary significantly may indicate hormonal fluctuations.",
    progress: "33%",
  },
  3: {
    id: 3,
    text: "How many days does your period typically last?",
    subtitle:
      "Count the days from when bleeding starts until it completely stops",
    options: [
      { id: "1_3", text: "1-3 days", description: "Shorter duration" },
      { id: "4_5", text: "4-5 days", description: "Average duration" },
      { id: "6_7", text: "6-7 days", description: "Longer duration" },
      { id: "8_plus", text: "8+ days", description: "Extended duration" },
      {
        id: "varies",
        text: "It varies",
        description: "Changes from cycle to cycle",
      },
      {
        id: "not_sure",
        text: "I'm not sure",
        description: "Need help tracking",
      },
    ],
    info: "A typical period lasts between 3-7 days. Periods lasting longer than 7 days may indicate hormonal imbalances or other health conditions.",
    progress: "50%",
  },
  4: {
    id: 4,
    text: "How would you describe your menstrual flow?",
    subtitle:
      "Select the option that best describes your typical flow heaviness",
    options: [
      {
        id: "light",
        text: "Light",
        description: "Minimal bleeding, may only need panty liners",
      },
      {
        id: "moderate",
        text: "Moderate",
        description: "Regular bleeding, requires normal protection",
      },
      {
        id: "heavy",
        text: "Heavy",
        description: "Substantial bleeding, requires frequent changes",
      },
      {
        id: "very_heavy",
        text: "Very Heavy",
        description: "Excessive bleeding, may soak through protection",
      },
      {
        id: "varies",
        text: "It varies",
        description: "Changes throughout your period or between cycles",
      },
      {
        id: "not_sure",
        text: "I'm not sure",
        description: "Need help determining flow heaviness",
      },
    ],
    info: "Most people lose 30-80ml of blood during their period. Menstrual flow that consistently soaks through a pad/tampon every hour for several hours may indicate heavy menstrual bleeding (menorrhagia).",
    progress: "67%",
  },
  5: {
    id: 5,
    text: "How would you rate your menstrual pain?",
    subtitle:
      "Select the option that best describes your typical pain level during your period",
    options: [
      {
        id: "none",
        text: "No Pain",
        description: "I don't experience any discomfort during my period",
      },
      {
        id: "mild",
        text: "Mild",
        description: "Noticeable but doesn't interfere with daily activities",
      },
      {
        id: "moderate",
        text: "Moderate",
        description: "Uncomfortable and may require pain relief",
      },
      {
        id: "severe",
        text: "Severe",
        description: "Significant pain that limits normal activities",
      },
      {
        id: "debilitating",
        text: "Debilitating",
        description: "Extreme pain that prevents normal activities",
      },
      {
        id: "varies",
        text: "It varies",
        description:
          "Pain level changes throughout your period or between cycles",
      },
    ],
    info: "Mild to moderate menstrual cramps (dysmenorrhea) are common. They're caused by substances called prostaglandins that help the uterus contract to shed its lining.",
    progress: "83%",
  },
  6: {
    id: 6,
    text: "Do you experience any other symptoms with your period?",
    subtitle:
      "Select all that apply. These could occur before, during, or after your period.",
    options: [
      {
        id: "physical",
        text: "Physical symptoms",
        multiSelect: true,
        choices: [
          "Bloating",
          "Breast tenderness",
          "Headaches",
          "Back pain",
          "Nausea",
          "Fatigue",
          "Dizziness",
          "Acne",
          "Digestive issues",
          "Sleep disturbances",
          "Hot flashes",
          "Joint pain",
        ],
      },
      {
        id: "emotional",
        text: "Emotional/Mood symptoms",
        multiSelect: true,
        choices: [
          "Irritability",
          "Mood swings",
          "Anxiety",
          "Depression",
          "Difficulty concentrating",
          "Food cravings",
          "Emotional sensitivity",
          "Low energy/motivation",
        ],
      },
    ],
    info: "It's normal to experience several symptoms during your menstrual cycle. Hormonal fluctuations can affect your body in many ways beyond just bleeding.",
    progress: "100%",
  },
};

// Get a specific question by ID
export const getQuestionById = (id) => {
  return questions[id];
};

// Analyze assessment answers to generate results
export const analyzeAssessment = (answers) => {
  // Extract key information from answers
  const age = answers[1];
  const cycleLength = answers[2];
  const periodDuration = answers[3];
  const flowHeaviness = answers[4];
  const painLevel = answers[5];
  const symptoms = answers[6];

  // Determine age category for analysis
  let ageCategory = "";
  if (age === "under_12" || age === "12_14") {
    ageCategory = "Early adolescence";
  } else if (age === "15_17") {
    ageCategory = "Late adolescence";
  } else if (age === "18_24") {
    ageCategory = "Young adult";
  } else {
    ageCategory = "Adult";
  }

  // Basic analysis (in production, this would be more sophisticated)
  const analysis = {
    status: "Developing Normally",
    cycleDetails: {
      age: ageCategory,
      cycleLength: getCycleLengthText(cycleLength),
      periodDuration: getPeriodDurationText(periodDuration),
      symptoms: getSymptomsList(symptoms),
      painLevel: getPainLevelText(painLevel),
      flowHeaviness: getFlowHeavinessText(flowHeaviness),
    },
    analysis: generateAnalysisText(
      cycleLength,
      periodDuration,
      flowHeaviness,
      painLevel
    ),
    recommendations: generateRecommendations(
      age,
      cycleLength,
      painLevel,
      symptoms
    ),
  };

  return analysis; // Make sure this line exists!
};

// Helper functions for text generation
function getCycleLengthText(cycleLength) {
  const mapping = {
    "21_25": "21-25 days",
    "26_30": "26-30 days",
    "31_35": "31-35 days",
    "36_40": "36-40 days",
    irregular: "Irregular",
    not_sure: "Unknown",
  };
  return mapping[cycleLength] || "Unknown";
}

function getPeriodDurationText(duration) {
  const mapping = {
    "1_3": "1-3 days",
    "4_5": "4-5 days",
    "6_7": "6-7 days",
    "8_plus": "8+ days",
    varies: "Varies",
    not_sure: "Unknown",
  };
  return mapping[duration] || "Unknown";
}

function getPainLevelText(pain) {
  const mapping = {
    none: "No pain",
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
    debilitating: "Debilitating",
    varies: "Varies",
  };
  return mapping[pain] || "Unknown";
}

function getFlowHeavinessText(flow) {
  const mapping = {
    light: "Light",
    moderate: "Moderate",
    heavy: "Heavy",
    very_heavy: "Very Heavy",
    varies: "Varies",
    not_sure: "Unknown",
  };
  return mapping[flow] || "Unknown";
}

function getSymptomsList(symptoms) {
  if (!symptoms || (!symptoms.physical && !symptoms.emotional)) {
    return ["None reported"];
  }

  let symptomsList = [];
  if (symptoms.physical) {
    symptomsList = symptomsList.concat(symptoms.physical);
  }
  if (symptoms.emotional) {
    symptomsList = symptomsList.concat(symptoms.emotional);
  }

  return symptomsList;
}

function generateAnalysisText(
  cycleLength,
  periodDuration,
  flowHeaviness,
  painLevel
) {
  let analysisText = "";

  // Cycle length analysis
  if (
    cycleLength === "21_25" ||
    cycleLength === "26_30" ||
    cycleLength === "31_35"
  ) {
    analysisText += "Your cycle length is within the normal range. ";
  } else if (cycleLength === "36_40") {
    analysisText +=
      "Your cycle is slightly longer than average, which can be normal for some people. ";
  } else if (cycleLength === "irregular") {
    analysisText +=
      "Your irregular cycle could be influenced by various factors including stress, weight changes, or hormonal fluctuations. ";
  }

  // Period duration analysis
  if (
    periodDuration === "1_3" ||
    periodDuration === "4_5" ||
    periodDuration === "6_7"
  ) {
    analysisText += "Your period duration is within the normal range. ";
  } else if (periodDuration === "8_plus") {
    analysisText +=
      "Your extended period duration might be worth discussing with a healthcare provider. ";
  }

  // Pain analysis
  if (
    painLevel === "moderate" ||
    painLevel === "severe" ||
    painLevel === "debilitating"
  ) {
    analysisText +=
      "The level of pain you're experiencing could benefit from management strategies or medical evaluation. ";
  }

  return analysisText;
}

function generateRecommendations(age, cycleLength, painLevel, symptoms) {
  const recommendations = [];

  // Universal recommendations
  recommendations.push({
    title: "Track Your Cycle",
    description:
      "Keep a record of when your period starts and stops. This can help you predict your next period and identify patterns.",
  });

  // Age-specific recommendations
  if (age === "under_12" || age === "12_14" || age === "15_17") {
    recommendations.push({
      title: "Be Patient With Your Cycle",
      description:
        "It can take up to 2 years after your first period for cycles to become regular. Variation is normal during adolescence.",
    });
  }

  // Pain-related recommendations
  if (
    painLevel === "moderate" ||
    painLevel === "severe" ||
    painLevel === "debilitating"
  ) {
    recommendations.push({
      title: "Pain Management",
      description:
        "Over-the-counter pain relievers like ibuprofen can help with cramps. A heating pad on your lower abdomen may also provide relief.",
    });

    if (painLevel === "severe" || painLevel === "debilitating") {
      recommendations.push({
        title: "Consult a Healthcare Provider",
        description:
          "Severe pain that disrupts your life should be discussed with a healthcare provider, as it might indicate conditions like endometriosis.",
      });
    }
  }

  // General wellness recommendations
  recommendations.push({
    title: "Stay Active",
    description:
      "Regular exercise can help reduce period pain and manage mood changes.",
  });

  recommendations.push({
    title: "Maintain a Balanced Diet",
    description:
      "Eating nutritious foods, staying hydrated, and limiting salt, sugar, and caffeine can help manage symptoms.",
  });

  return recommendations;
}

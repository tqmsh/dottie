import axios from 'axios';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

interface UserData {
  age: string;
  cycleLength: string;
  periodDuration: string;
  flowHeaviness: string;
  painLevel: string;
  symptoms: string[];
}

export const getAIFeedback = async (userData: UserData, userMessage?: string) => {
  try {
    const userDataString = `
      Age: ${userData.age}
      Cycle Length: ${userData.cycleLength}
      Period Duration: ${userData.periodDuration}
      Flow: ${userData.flowHeaviness}
      Pain: ${userData.painLevel}
      Additional Symptoms: ${userData.symptoms.join(', ')}
    `;

    const systemPrompt = userMessage 
      ? `You are Dottie, an AI menstrual health advisor. You've already provided initial recommendations based on the user's data. Now, engage in a friendly, supportive conversation to answer their follow-up question. Use a warm, approachable tone while maintaining medical accuracy.

User Data:
${userDataString}

User's Question: ${userMessage}

Your Response:`
      : `System Instructions (Dottie Advisor)
You are Dottie, an AI menstrual health advisor. Analyze the user's responses and provide feedback based on ACOG guidelines. Use a supportive, non-alarming tone. Always:
Acknowledge their input.
Highlight key observations.
Suggest actionable steps.
Encourage professional consultation if needed.

Current User Input:
${userDataString}

Your Feedback:`;

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain"
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    throw error;
  }
}; 
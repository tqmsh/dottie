# Dottie - Menstrual Health Assessment API

## Overview

Dottie is a user-friendly application designed to help individuals understand their menstrual health better. Through a series of simple questions, Dottie collects information about your menstrual cycle and provides personalized analysis and recommendations.

## How It Works

### Assessment Process

1. **Start an Assessment**: Begin by answering questions about your menstrual health
2. **Answer Questions**: Complete a series of 6 questions about your cycle
3. **Get Personalized Results**: Receive analysis and recommendations based on your answers

### Questions Covered

- Age group
- Menstrual cycle length
- Period duration
- Flow heaviness
- Pain level
- Physical and emotional symptoms

## Features

- **Progressive Assessment**: Questions appear one at a time for a better user experience
- **Age-Appropriate Guidance**: Tailored information based on your age group
- **Symptom Analysis**: Identifies patterns in your reported symptoms
- **Personalized Recommendations**: Practical advice based on your specific situation
- **Educational Content**: Learn more about what's normal and when to seek help

## Technical Information

### API Endpoints

| Endpoint                                | Method | Description                                       |
| --------------------------------------- | ------ | ------------------------------------------------- |
| `/api/hello`                            | GET    | Test endpoint to verify API is working            |
| `/api/assessment/start`                 | POST   | Start a new assessment and get the first question |
| `/api/assessment/answer`                | POST   | Submit an answer and receive the next question    |
| `/api/assessment/results/:assessmentId` | GET    | Get final assessment results                      |

### Data Flow

1. Client starts assessment → Server creates unique assessment ID
2. Client submits answers → Server stores data and returns next question
3. After final question → Server analyzes all answers
4. Client requests results → Server provides analysis and recommendations

## Answer Format Examples

### Question 1: Age

```javascript
{
  "assessmentId": "your-assessment-id",
  "questionId": 1,
  "answer": "15_17"  // Options: "under_12", "12_14", "15_17", "18_24", "over_24"
}
```

### Question 2: Menstrual Cycle Length

```javascript
{
  "assessmentId": "your-assessment-id",
  "questionId": 2,
  "answer": "26_30"  // Options: "less_than_21", "21_25", "26_30", "31_35", "more_than_35", "irregular"
}
```

### Question 3: Period Duration

```javascript
{
  "assessmentId": "your-assessment-id",
  "questionId": 3,
  "answer": "4_5"  // Options: "1_3", "4_5", "6_7", "more_than_7"
}
```

### Question 4: Flow Heaviness

```javascript
{
  "assessmentId": "your-assessment-id",
  "questionId": 4,
  "answer": "moderate"  // Options: "light", "moderate", "heavy", "very_heavy"
}
```

### Question 5: Pain Level

```javascript
{
  "assessmentId": "your-assessment-id",
  "questionId": 5,
  "answer": "moderate"  // Options: "none", "mild", "moderate", "severe", "debilitating"
}
```

### Question 6: Symptoms

```javascript
{
  "assessmentId": "your-assessment-id",
  "questionId": 6,
  "answer": {
    "physical": ["Bloating", "Headaches", "Fatigue"],  // Select all that apply
    "emotional": ["Mood swings", "Irritability", "Anxiety"]  // Select all that apply
  }
}
```

## Example Response

```json
{
  "assessmentId": "unique-id",
  "results": {
    "status": "Developing Normally",
    "cycleDetails": {
      "age": "Young adult",
      "cycleLength": "26-30 days",
      "periodDuration": "4-5 days",
      "symptoms": ["Bloating", "Mood swings"],
      "painLevel": "Moderate",
      "flowHeaviness": "Moderate"
    },
    "analysis": "Your cycle length is within the normal range. Your period duration is within the normal range.",
    "recommendations": [
      {
        "title": "Track Your Cycle",
        "description": "Keep a record of when your period starts and stops to identify patterns."
      },
      {
        "title": "Pain Management",
        "description": "Over-the-counter pain relievers like ibuprofen can help with cramps."
      }
    ]
  },
  "completedAt": "2025-03-15T18:30:00.000Z"
}
```

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dottie.git
```

2. Navigate to the project directory:

```bash
cd dottie/backend
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. The API will be available at `http://localhost:5000`

## Testing

Run tests using Playwright:

```bash
npx playwright test --project=api
```

Or manually test using Postman by importing the collection file `Dottie-API.postman_collection.json`.

## Project Structure

```
backend/
├── controllers/        # Request handlers
│   └── assessmentController.js
├── services/           # Business logic
│   └── assessmentService.js
├── routes/             # API route definitions
│   └── assessmentRoutes.js
├── tests/              # Automated tests
│   └── api-comprehensive.test.js
└── server.js           # Main application entry point
```

## For Developers

### Frontend Integration

#### Starting an Assessment

```javascript
const startAssessment = async () => {
  const response = await fetch("http://localhost:5000/api/assessment/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
```

#### Submitting Answers

```javascript
const submitAnswer = async (assessmentId, questionId, answer) => {
  const response = await fetch("http://localhost:5000/api/assessment/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assessmentId, questionId, answer }),
  });
  return await response.json();
};
```

import { v4 as uuidv4 } from "uuid";

// Simple in-memory storage
const assessments = {};

// Start a new assessment
export const startAssessment = (req, res) => {
  const assessmentId = uuidv4();
  
  assessments[assessmentId] = {
    id: assessmentId,
    startedAt: new Date(),
    completed: false
  };
  
  res.status(201).json({
    assessmentId,
    message: "Assessment started"
  });
};

// Submit an assessment
export const submitAssessment = (req, res) => {
  const { assessmentId } = req.params;
  const data = req.body;
  
  if (!assessmentId || !assessments[assessmentId]) {
    return res.status(404).json({ error: "Assessment not found" });
  }
  
  // Store assessment data
  assessments[assessmentId] = {
    ...assessments[assessmentId],
    ...data,
    completed: true,
    completedAt: new Date()
  };
  
  res.json({
    assessmentId,
    message: "Assessment submitted successfully"
  });
};

// Get assessment by ID
export const getAssessment = (req, res) => {
  const { assessmentId } = req.params;
  
  if (!assessmentId || !assessments[assessmentId]) {
    return res.status(404).json({ error: "Assessment not found" });
  }
  
  res.json(assessments[assessmentId]);
};

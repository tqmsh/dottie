import express from "express";
import { authenticateToken } from "./middleware.js";
import { assessments } from "./store.js";

const router = express.Router();

router.post("/send", authenticateToken, (req, res) => {
  try {
    const { assessmentData } = req.body;
    
    // Validate assessment data
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }
    
    // Generate a new assessment ID
    const id = `assessment-${Date.now()}`;
    
    // Create the assessment object
    const assessment = { 
      id,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      assessmentData
    };
    
    // Store in memory
    assessments.push(assessment);
    
    res.status(201).json(assessment);
  } catch (error) {
    console.error('Error sending assessment:', error);
    res.status(500).json({ error: 'Failed to send assessment' });
  }
});

export default router; 
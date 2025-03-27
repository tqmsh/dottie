import express from "express";
import { authenticateToken } from "./middleware.js";
import { assessments } from "./store.js";
import db from "../../db/index.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/send", authenticateToken, async (req, res) => {
  try {
    const { assessmentData } = req.body;
    
    // Validate assessment data
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }
    
    const userId = req.user.id;
    
    // For test users, save to database
    if (userId.startsWith('test-')) {
      try {
        // Generate a new assessment ID
        const id = `test-assessment-${Date.now()}`;
        
        // Insert into database
        await db('assessments').insert({
          id: id,
          user_id: userId,
          created_at: new Date().toISOString(),
          age: assessmentData.age,
          cycle_length: assessmentData.cycleLength,
          period_duration: assessmentData.periodDuration,
          flow_heaviness: assessmentData.flowHeaviness,
          pain_level: assessmentData.painLevel
        });
        
        // Insert symptoms if provided
        if (assessmentData.symptoms) {
          const symptoms = [];
          
          // Add physical symptoms
          if (assessmentData.symptoms.physical && Array.isArray(assessmentData.symptoms.physical)) {
            for (const symptom of assessmentData.symptoms.physical) {
              symptoms.push({
                assessment_id: id,
                symptom_name: symptom,
                symptom_type: 'physical'
              });
            }
          }
          
          // Add emotional symptoms
          if (assessmentData.symptoms.emotional && Array.isArray(assessmentData.symptoms.emotional)) {
            for (const symptom of assessmentData.symptoms.emotional) {
              symptoms.push({
                assessment_id: id,
                symptom_name: symptom,
                symptom_type: 'emotional'
              });
            }
          }
          
          // Insert symptoms if any exists
          if (symptoms.length > 0) {
            await db('symptoms').insert(symptoms);
          }
        }
        
        // Return the created assessment
        return res.status(201).json({
          id: id,
          userId: userId,
          createdAt: new Date().toISOString(),
          assessmentData: assessmentData
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to in-memory storage if database fails
      }
    }
    
    // Generate a new assessment ID
    const id = `assessment-${Date.now()}`;
    
    // Create the assessment object
    const assessment = { 
      id,
      userId: userId,
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
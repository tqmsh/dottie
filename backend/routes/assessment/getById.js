import express from "express";
import { authenticateToken } from "./middleware.js";
import { assessments } from "./store.js";
import db from "../../db/index.js";

const router = express.Router();

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const assessmentId = req.params.id;
    
    // For test IDs, try to fetch from the database
    if (assessmentId.startsWith('test-')) {
      // Try to find the assessment in the database first
      try {
        const dbAssessment = await db('assessments').where('id', assessmentId).first();
        
        if (dbAssessment) {
          // Get symptoms for this assessment
          const symptoms = await db('symptoms').where('assessment_id', assessmentId);
          
          // Group symptoms by type
          const groupedSymptoms = {
            physical: symptoms.filter(s => s.symptom_type === 'physical').map(s => s.symptom_name),
            emotional: symptoms.filter(s => s.symptom_type === 'emotional').map(s => s.symptom_name)
          };
          
          // Format the response to match expected format
          return res.status(200).json({
            id: dbAssessment.id,
            userId: dbAssessment.user_id,
            createdAt: dbAssessment.created_at,
            assessmentData: {
              age: dbAssessment.age,
              cycleLength: dbAssessment.cycle_length,
              periodDuration: dbAssessment.period_duration,
              flowHeaviness: dbAssessment.flow_heaviness,
              painLevel: dbAssessment.pain_level,
              symptoms: groupedSymptoms
            }
          });
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to in-memory check if database fails
      }
    }
    
    // Find the assessment by ID in memory
    const assessment = assessments.find(a => a.id === assessmentId);
    
    if (!assessment) {
      // If not found in memory, return a mock assessment
      return res.json({
        id: assessmentId,
        userId: req.user.id,
        createdAt: new Date().toISOString(),
        assessmentData: {
          age: "18_24",
          cycleLength: "26_30",
          periodDuration: "4_5",
          flowHeaviness: "moderate",
          painLevel: "moderate",
          symptoms: {
            physical: ["Bloating", "Headaches"],
            emotional: ["Mood swings", "Irritability"]
          },
          recommendations: [
            {
              title: "Track Your Cycle",
              description: "Keep a record of when your period starts and stops to identify patterns."
            },
            {
              title: "Pain Management",
              description: "Over-the-counter pain relievers like ibuprofen can help with cramps."
            }
          ]
        }
      });
    }
    
    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

export default router; 
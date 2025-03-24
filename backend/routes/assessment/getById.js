import express from "express";
import { authenticateToken } from "./middleware.js";
import { assessments } from "./store.js";

const router = express.Router();

router.get("/:id", authenticateToken, (req, res) => {
  try {
    const assessmentId = req.params.id;
    
    // Find the assessment by ID
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
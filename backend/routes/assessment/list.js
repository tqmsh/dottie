import express from "express";
import { authenticateToken } from "./middleware.js";
import { assessments } from "./store.js";

const router = express.Router();

router.get("/list", authenticateToken, (req, res) => {
  try {
    // Filter assessments by user ID
    const userAssessments = assessments.filter(a => a.userId === req.user.id);
    res.json(userAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

export default router; 
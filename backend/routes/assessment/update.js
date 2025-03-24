import express from 'express';
import { authenticateToken } from './middleware.js';
import Assessment from '../../models/Assessment.js';

const router = express.Router();

/**
 * Update an assessment
 * PUT /api/assessment/:id
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { assessmentData } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }

    // Check if assessment exists and belongs to user
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    if (assessment.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this assessment' });
    }

    // Update assessment
    const updatedAssessment = await Assessment.update(id, assessmentData);

    res.status(200).json(updatedAssessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ error: 'Failed to update assessment' });
  }
});

export default router; 
import express from 'express';
import { authenticateToken } from '../auth/middleware.js';
import Assessment from '../../models/Assessment.js';

const router = express.Router();

/**
 * Delete an assessment
 * DELETE /api/assessment/:id
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if assessment exists and belongs to user
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    if (assessment.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this assessment' });
    }

    // Delete assessment
    await Assessment.delete(id);

    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
});

export default router; 
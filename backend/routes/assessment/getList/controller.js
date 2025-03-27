import { assessments } from "../store.js";
import db from "../../../db/index.js";

/**
 * Get list of all assessments for a specific user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const listAssessments = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // For test users, try to fetch from the database
    if (userId.startsWith('test-')) {
      try {
        // Get assessments from database
        const dbAssessments = await db('assessments').where('user_id', userId);
        
        if (dbAssessments && dbAssessments.length > 0) {
          // Get all symptoms for these assessments
          const assessmentIds = dbAssessments.map(a => a.id);
          const symptoms = await db('symptoms').whereIn('assessment_id', assessmentIds);
          
          // Map database results to expected format
          const formattedAssessments = await Promise.all(dbAssessments.map(async (assessment) => {
            // Group symptoms by type for this assessment
            const assessmentSymptoms = symptoms.filter(s => s.assessment_id === assessment.id);
            const groupedSymptoms = {
              physical: assessmentSymptoms.filter(s => s.symptom_type === 'physical').map(s => s.symptom_name),
              emotional: assessmentSymptoms.filter(s => s.symptom_type === 'emotional').map(s => s.symptom_name)
            };
            
            return {
              id: assessment.id,
              userId: assessment.user_id,
              createdAt: assessment.created_at,
              assessmentData: {
                age: assessment.age,
                cycleLength: assessment.cycle_length,
                periodDuration: assessment.period_duration,
                flowHeaviness: assessment.flow_heaviness,
                painLevel: assessment.pain_level,
                symptoms: groupedSymptoms
              }
            };
          }));
          
          return res.status(200).json(formattedAssessments);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to in-memory check if database fails
      }
    }
    
    // Filter assessments by user ID from in-memory store
    const userAssessments = assessments.filter(a => a.userId === userId);
    res.json(userAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
}; 
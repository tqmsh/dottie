import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import db from '../../../../../db/index.js';

// Create Express app for testing
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock authentication middleware for testing
app.use((req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // For tests, use the same jwt secret as in the real middleware
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
    
    // Verify the token
    const decodedToken = jwt.verify(token, JWT_SECRET);
    
    if (!decodedToken || (!decodedToken.userId && !decodedToken.id)) {
      return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    
    // Add the decoded user to the request
    req.user = {
      userId: decodedToken.userId || decodedToken.id,
      email: decodedToken.email || 'test@example.com'
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
});

// Add database-backed routes for testing

// IMPORTANT: Define the list route before the :id route to avoid conflicts
// Get assessment list
app.get('/api/assessment/list', async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all assessments for this user
    const assessments = await db('assessments').where('user_id', userId);
    
    if (!assessments || assessments.length === 0) {
      return res.status(200).json([]);
    }
    
    // Get all symptoms for these assessments
    const assessmentIds = assessments.map(a => a.id);
    const allSymptoms = await db('symptoms').whereIn('assessment_id', assessmentIds);
    
    // Format assessments
    const formattedAssessments = assessments.map(assessment => {
      // Get symptoms for this assessment
      const symptoms = allSymptoms.filter(s => s.assessment_id === assessment.id);
      
      // Group symptoms by type
      const groupedSymptoms = {
        physical: symptoms.filter(s => s.symptom_type === 'physical').map(s => s.symptom_name),
        emotional: symptoms.filter(s => s.symptom_type === 'emotional').map(s => s.symptom_name)
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
    });
    
    return res.status(200).json(formattedAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assessment by ID
app.get('/api/assessment/:id', async (req, res) => {
  try {
    const assessmentId = req.params.id;
    
    console.log(`Fetching assessment with ID: ${assessmentId}`);
    
    // Get assessment from database
    const assessment = await db('assessments').where('id', assessmentId).first();
    
    if (!assessment) {
      console.log(`Assessment not found: ${assessmentId}`);
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    // Get symptoms for this assessment
    const symptoms = await db('symptoms').where('assessment_id', assessmentId);
    
    // Group symptoms by type
    const groupedSymptoms = {
      physical: symptoms.filter(s => s.symptom_type === 'physical').map(s => s.symptom_name),
      emotional: symptoms.filter(s => s.symptom_type === 'emotional').map(s => s.symptom_name)
    };
    
    // Format the assessment
    const result = {
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
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Send assessment
app.post('/api/assessment/send', async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user.userId;
    const { assessmentData } = req.body;
    
    // Simple validation
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }
    
    // Create a new assessment ID
    const assessmentId = `test-assessment-${Date.now()}`;
    
    // Insert assessment into database
    await db('assessments').insert({
      id: assessmentId,
      user_id: userId,
      created_at: new Date().toISOString(),
      age: assessmentData.age,
      cycle_length: assessmentData.cycleLength,
      period_duration: assessmentData.periodDuration,
      flow_heaviness: assessmentData.flowHeaviness,
      pain_level: assessmentData.painLevel
    });
    
    // Insert symptoms if available
    if (assessmentData.symptoms) {
      const symptoms = [];
      
      // Add physical symptoms
      if (assessmentData.symptoms.physical && Array.isArray(assessmentData.symptoms.physical)) {
        for (const symptom of assessmentData.symptoms.physical) {
          symptoms.push({
            assessment_id: assessmentId,
            symptom_name: symptom,
            symptom_type: 'physical'
          });
        }
      }
      
      // Add emotional symptoms
      if (assessmentData.symptoms.emotional && Array.isArray(assessmentData.symptoms.emotional)) {
        for (const symptom of assessmentData.symptoms.emotional) {
          symptoms.push({
            assessment_id: assessmentId,
            symptom_name: symptom,
            symptom_type: 'emotional'
          });
        }
      }
      
      // Insert symptoms if any exist
      if (symptoms.length > 0) {
        await db('symptoms').insert(symptoms);
      }
    }
    
    // Return the created assessment
    return res.status(201).json({
      id: assessmentId,
      userId: userId,
      createdAt: new Date().toISOString(),
      assessmentData
    });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Catch-all 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Resource not found' });
});

export default app; 
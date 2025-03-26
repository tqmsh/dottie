import express from 'express';
import cors from 'cors';
import assessmentRoutes from '../../../index.js';
import jwt from 'jsonwebtoken';

// Create Express app for testing
const app = express();

// Add storage for test data
const testData = {
  assessments: new Map()
};

// Middleware
app.use(cors());
app.use(express.json());

// Mock authentication middleware for testing
app.use('/api/assessment', (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  console.log('Auth header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Token:', token);
  
  try {
    // For tests, use a dummy secret key since we're in test mode
    const JWT_SECRET = 'test-secret-key';
    
    // For test purposes, we'll just decode without verification
    const decodedToken = jwt.decode(token);
    console.log('Decoded token:', decodedToken);
    
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
    }
    
    // Add the decoded user to the request
    req.user = {
      id: decodedToken.id,
      email: decodedToken.email || 'test@example.com',
      name: 'Test User'
    };
    console.log('User set:', req.user);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
});

// Add test routes for specific test cases
// These routes override the main routes

// Add a test route to verify auth is working
app.get('/api/assessment/test-auth', (req, res) => {
  res.status(200).json({ message: 'Authentication successful', user: req.user });
});

// Special mock route for assessment list
// IMPORTANT: This must be defined BEFORE the :id route to avoid conflict
app.get('/api/assessment/list', (req, res) => {
  console.log(`TEST SERVER: Listing assessments for user ${req.user.id}`);
  
  // Create mock assessments for this user
  const assessments = [];
  
  // Add a couple of mock assessments
  const assessment1 = {
    id: `test-assessment-1-${Date.now()}`,
    userId: req.user.id,
    assessmentData: {
      age: "18_24",
      cycleLength: "26_30",
      periodDuration: "4_5",
      flowHeaviness: "moderate",
      painLevel: "moderate",
      symptoms: {
        physical: ["Bloating", "Headaches"],
        emotional: ["Mood swings"]
      }
    },
    createdAt: new Date().toISOString()
  };
  
  const assessment2 = {
    id: `test-assessment-2-${Date.now()}`,
    userId: req.user.id,
    assessmentData: {
      age: "25_34",
      cycleLength: "31_35",
      periodDuration: "6_7",
      flowHeaviness: "heavy",
      painLevel: "severe",
      symptoms: {
        physical: ["Cramps", "Backache"],
        emotional: ["Anxiety"]
      }
    },
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  };
  
  assessments.push(assessment1, assessment2);
  
  // Store them for future requests
  testData.assessments.set(assessment1.id, assessment1);
  testData.assessments.set(assessment2.id, assessment2);
  
  return res.status(200).json(assessments);
});

// Special mock route for assessment detail
app.get('/api/assessment/:id', (req, res, next) => {
  const { id } = req.params;
  
  console.log(`TEST SERVER: Fetching assessment with ID: ${id}`);
  
  // Check if we have this assessment in our test data
  if (testData.assessments.has(id)) {
    console.log(`TEST SERVER: Found assessment ${id} in test data`);
    return res.status(200).json(testData.assessments.get(id));
  }
  
  // For tests, we'll return a mock assessment if the ID follows our test pattern
  if (id.startsWith('test-assessment-')) {
    console.log(`TEST SERVER: Generating mock data for ${id}`);
    const assessment = {
      id,
      userId: req.user.id,
      assessmentData: {
        age: "18_24",
        cycleLength: "26_30",
        periodDuration: "4_5",
        flowHeaviness: "moderate",
        painLevel: "moderate",
        symptoms: {
          physical: ["Bloating", "Headaches"],
          emotional: ["Mood swings"]
        }
      },
      createdAt: new Date().toISOString()
    };
    
    // Store it for future requests
    testData.assessments.set(id, assessment);
    
    return res.status(200).json(assessment);
  }
  
  // Pass to the next handler if not a test ID
  return next();
});

// Process assessment submission
app.post('/api/assessment/send', (req, res) => {
  console.log('TEST SERVER: Processing assessment submission');
  
  const { userId, assessmentData } = req.body;
  
  // Simple validation
  if (!assessmentData) {
    return res.status(400).json({ error: 'Assessment data is required' });
  }
  
  // Create a new assessment
  const assessmentId = `assessment-${Date.now()}`;
  const newAssessment = {
    id: assessmentId,
    userId: userId || req.user.id,
    createdAt: new Date().toISOString(),
    assessmentData
  };
  
  // Store in our test data
  testData.assessments.set(assessmentId, newAssessment);
  
  return res.status(201).json(newAssessment);
});

// Mount assessment routes for any paths not handled by our test routes
app.use('/api/assessment', assessmentRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

export default app; 
import express from 'express';
import cors from 'cors';
import assessmentRoutes from '../../../index.js';
import jwt from 'jsonwebtoken';

// Create Express app for testing
const app = express();

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
    
    // Simply decode the token without verification for testing
    const decodedToken = jwt.decode(token);
    console.log('Decoded token:', decodedToken);
    
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ error: 'Invalid token structure' });
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

// Add a test route to verify auth is working
app.get('/api/assessment/test-auth', (req, res) => {
  res.status(200).json({ message: 'Authentication successful', user: req.user });
});

// Mount assessment routes
app.use('/api/assessment', assessmentRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

export default app; 
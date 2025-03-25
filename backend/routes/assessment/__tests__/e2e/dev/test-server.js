import express from 'express';
import cors from 'cors';
import assessmentRoutes from '../../../index.js';

// Create Express app for testing
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock authentication middleware for testing
app.use('/api/assessment', (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Simulate successful auth by adding a mock user to the request
    req.user = {
      id: req.body.userId || 'test-user-id',
      email: 'test@example.com',
      name: 'Test User'
    };
  }
  next();
});

// Mount assessment routes
app.use('/api/assessment', assessmentRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

export default app; 
import express from "express";
import { verifyToken } from '../auth/middleware.js';
import { 
  startAssessment, 
  submitAnswer, 
  getResults 
} from '../../controllers/assessmentController.js';

// Import individual route files
import sendRouter from './send.js';
import listRouter from './list.js';
import getByIdRouter from './getById.js';
import updateRouter from './update.js';
import deleteRouter from './delete.js';

const router = express.Router();

// Start a new assessment
router.post('/start', verifyToken, startAssessment);

// Submit an answer for the current question
router.post('/submit', verifyToken, submitAnswer);

// Get assessment results
router.get('/results/:assessmentId', verifyToken, getResults);

// Mount individual route handlers
router.use(sendRouter);
router.use(listRouter);
router.use(getByIdRouter);
router.use(updateRouter);
router.use(deleteRouter);

export default router; 
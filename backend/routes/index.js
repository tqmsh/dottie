import express from 'express';
import authRoutes from './auth/index.js';
import assessmentRoutes from './assessment/index.js';
import userRoutes from './user/index.js';
import setupRoutes from './setup/index.js';

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/assessment', assessmentRoutes);
router.use('/users', userRoutes);
router.use('/setup', setupRoutes);

export default router; 
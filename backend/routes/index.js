import express from 'express';
import authRoutes from './auth/index.js';

const router = express.Router();

// Mount auth routes
router.use('/auth', authRoutes);

export default router; 
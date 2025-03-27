import express from 'express';
import authRoutes from './auth/index.js';
import userRoutes from './user/index.js';

const router = express.Router();

// Mount modular routes with new structure
router.use('/', authRoutes);
router.use('/users', userRoutes);

export default router; 
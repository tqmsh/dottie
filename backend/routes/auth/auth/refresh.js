import express from 'express';
import { refresh } from '../../controllers/auth/refresh.js';

const router = express.Router();

// Refresh token endpoint
router.post('/', refresh);

export default router; 
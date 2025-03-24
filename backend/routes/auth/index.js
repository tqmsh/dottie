import express from 'express';
import signupRoutes from './signup.js';
import loginRoutes from './login.js';
import verifyRoutes from './verify.js';
import refreshRoutes from './refresh.js';
import logoutRoutes from './logout.js';
import usersRoutes from './users.js';
import resetPasswordRoutes from './resetPassword.js';

const router = express.Router();

// Mount all auth routes
router.use('/signup', signupRoutes);
router.use('/login', loginRoutes);
router.use('/verify', verifyRoutes);
router.use('/refresh', refreshRoutes);
router.use('/logout', logoutRoutes);
router.use('/users', usersRoutes);
router.use('/', resetPasswordRoutes);

export default router; 
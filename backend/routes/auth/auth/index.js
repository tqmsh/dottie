import express from 'express';
import loginRoutes from './login.js';
import logoutRoutes from './logout.js';
import signupRoutes from './signup.js';
import refreshRoutes from './refresh.js';
// Import other auth routes as needed
// import resetPasswordRoutes from './resetPassword.js';
// import verifyRoutes from './verify.js';

const router = express.Router();

// Mount auth route modules
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/signup', signupRoutes);
router.use('/refresh', refreshRoutes);
// Mount other auth routes
// router.use('/reset-password', resetPasswordRoutes);
// router.use('/verify', verifyRoutes);

export default router; 
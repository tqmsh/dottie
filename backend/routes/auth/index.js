import express from 'express';
import loginRoutes from './login/route.js';
import logoutRoutes from './logout/route.js';
import signupRoutes from './signup/route.js';
import refreshRoutes from './refresh/route.js';
import verifyRoutes from './verify/route.js';
// Import other auth routes as needed
// import resetPasswordRoutes from './resetPassword/route.js';

const router = express.Router();

// Mount auth route modules
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/signup', signupRoutes);
router.use('/refresh', refreshRoutes);
router.use('/verify', verifyRoutes);
// Mount other auth routes
// router.use('/reset-password', resetPasswordRoutes);

export default router; 
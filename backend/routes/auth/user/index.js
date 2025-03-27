import express from 'express';
import getAllUsersRoute from './getAllUsers.js';
import getUserRoute from './getUser.js';
import updateUserRoute from './updateUser.js';
import deleteUserRoute from './deleteUser.js';

const router = express.Router();

// Mount user route modules
router.use('/', getAllUsersRoute);
router.use('/', getUserRoute);
router.use('/', updateUserRoute);
router.use('/', deleteUserRoute);

export default router; 
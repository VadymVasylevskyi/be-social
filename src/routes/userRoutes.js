import express from 'express';
import { getUserProfile, updateUserProfile, uploadProfileImage, getAllUsers } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all users
router.get('/all', getAllUsers);

// Get user
router.get('/:userId', getUserProfile);

// Update user
router.put('/current', authMiddleware, uploadProfileImage, updateUserProfile);




export default router;
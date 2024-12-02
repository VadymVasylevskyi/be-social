import express from 'express';
import { getUserFollowers, getUserFollowing, followUser, unfollowUser } from '../controllers/followController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
// Route to get followers of a user
router.get('/:userId/followers', authMiddleware, getUserFollowers);

// Route to get the list of users the user is following
router.get('/:userId/following', authMiddleware, getUserFollowing);

// Route to follow a user
router.post('/:userId/follow/:targetUserId', authMiddleware, followUser);

// Route to unfollow a user
router.delete('/:userId/unfollow/:targetUserId', authMiddleware, unfollowUser);


export default router;
import express from 'express';
import { getPostLikes, likePost, unlikePost } from '../controllers/likeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get likes for a post
router.get('/:postId/likes', authMiddleware, getPostLikes);

// Route to like a post
router.post('/:postId/like/:userId', authMiddleware, likePost);

// Route to remove a like from a post
router.delete('/:postId/unlike/:userId', authMiddleware, unlikePost);


export default router;
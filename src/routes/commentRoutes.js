/**
 * @swagger
 * /:postId:
 *   post:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
/**
 * @swagger
 * /:postId:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
/**
 * @swagger
 * /:commentId:
 *   delete:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */

import express from 'express';
import { createComment, getPostComments, deleteComment } from '../controllers/commentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add a comment to a post
router.post('/:postId/:userId', authMiddleware, createComment);

// Get all comments for a post
router.get('/:postId', getPostComments);

// Delete a comment
router.delete('/:commentId', authMiddleware, deleteComment);

export default router;
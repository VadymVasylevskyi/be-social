import express from 'express';
import upload from '../middlewares/multer.js';
import { createPost, getPostById, updatePost, deletePost, getUserPosts, getAllPosts } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Создание нового поста
router.post('/', authMiddleware, upload.single('image'), createPost);

// Получение поста по ID
router.get('/single/:postId', authMiddleware, getPostById);

// Обновление поста
router.put('/:postId', authMiddleware, updatePost);

// Удаление поста
router.delete('/:postId', authMiddleware, deletePost);

// Получение всех постов пользователя
router.get('/all', getUserPosts);

// Получение всех постов
router.get('/all/public', authMiddleware, getAllPosts);

export default router;
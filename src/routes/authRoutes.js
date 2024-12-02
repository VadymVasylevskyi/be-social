/**
 * @swagger
 * /register:
 *   post:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */


import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();


router.post('/register', register);

router.post('/login', login);

export default router;
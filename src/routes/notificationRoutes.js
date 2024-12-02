import express from 'express';
import { getUserNotifications, createNotification, deleteNotification, updateNotificationStatus } from '../controllers/notificationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
// Route to get all notifications for a user
router.get('/:userId/notifications', authMiddleware, getUserNotifications);

// Route to create a new notification
router.post('/notifications', authMiddleware, createNotification);

// Route to delete a notification
router.delete('/notifications/:notificationId', authMiddleware, deleteNotification);

// Route to update the status of a notification
router.patch('/notifications/:notificationId', authMiddleware, updateNotificationStatus);


export default router;
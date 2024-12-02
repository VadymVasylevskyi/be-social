import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.params.userId }).sort({ created_at: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error when receiving notifications' });
  }
};

export const createNotification = async (req, res) => {
  const { userId, type, content } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = new Notification({
      user_id: userId,
      type,
      content,
      created_at: new Date(),
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error when creating a notification' });
  }
};


export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await Notification.findByIdAndDelete(req.params.notificationId);
    res.status(200).json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error when deleting a notification' });
  }
};


export const updateNotificationStatus = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.is_read = req.body.is_read;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};
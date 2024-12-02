import jwt from 'jsonwebtoken';
import { loadMessages, sendMessage } from '../controllers/messageController.js';
import User from '../models/userModel.js';

// JWT authentication for WebSocket
export const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token; // Extract token from handshake.auth

  if (!token) {
    return next(new Error('Access denied. Token not provided.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return next(new Error('User not found.'));
    }

    // Attach authenticated user to the socket
    socket.user = user;
    next();
  } catch (error) {
    return next(new Error('Invalid token.'));
  }
};

// WebSocket event handling
export const messageSocketHandler = (socket, io) => {
  // User joining a room
  socket.on('joinRoom', ({ targetUserId }) => {
    const userId = socket.user._id; // Use userId from authenticated token
    const roomId = [userId, targetUserId].sort().join('_');
    socket.join(roomId);

    // Load message history upon joining
    loadMessages(userId, targetUserId, socket);
  });

  // Sending messages
  socket.on('sendMessage', ({ targetUserId, messageText }) => {
    const userId = socket.user._id; // Use userId from token
    const roomId = [userId, targetUserId].sort().join('_');
    sendMessage(userId, targetUserId, messageText, roomId, io);
  });

  // User disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};
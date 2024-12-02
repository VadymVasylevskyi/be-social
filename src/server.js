import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';
import { Server } from 'socket.io';
import { messageSocketHandler, authenticateSocket } from './routes/messageRoutes.js';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// WebSocket 
const io = new Server(server, {
  cors: {
    origin: '*', 
  },
});

// Middleware for WebSocket-auth
io.use((socket, next) => {
  authenticateSocket(socket, next); 
});

// WebSocket-connection
io.on('connection', (socket) => {
  console.log('Новое WebSocket соединение');

  messageSocketHandler(socket, io);
});
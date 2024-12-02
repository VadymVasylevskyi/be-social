import Message from '../models/messageModel.js';


export const loadMessages = async (userId, targetUserId, socket) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: targetUserId },
        { sender_id: targetUserId, receiver_id: userId },
      ],
    }).sort({ created_at: 1 }); 

  
    socket.emit('loadMessages', messages);
  } catch (error) {
    console.error('Error loading messages:', error);
    socket.emit('error', { error: 'Error loading messages' });
  }
};


export const sendMessage = async (userId, targetUserId, messageText, roomId, io) => {
  try {
    const message = new Message({
      sender_id: userId,
      receiver_id: targetUserId,
      message_text: messageText,
      created_at: new Date(),
    });

    await message.save();

   
    io.emit("receiveMessage", message);
  } catch (error) {
    console.error("Error when sending a message:", error);
  }
};
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

let connectedUsersCount = 0;

io.on('connection', (socket) => {
  connectedUsersCount++;
  
  io.emit('user_count_update', connectedUsersCount);

  socket.broadcast.emit('notification', `A new user joined the chat (ID: ${socket.id})`);

  socket.on('send_private_message', ({ to, message }) => {
    io.to(to).emit('receive_private_message', {
      from: socket.id,
      message,
    });
  });

  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('notification', `User ${socket.id} has joined room ${roomName}`);
  });

  socket.on('send_room_message', ({ room, message }) => {
    io.to(room).emit('receive_room_message', {
      from: socket.id,
      message,
    });
  });

  socket.on('disconnect', () => {
    connectedUsersCount--;
    io.emit('user_count_update', connectedUsersCount);
    socket.broadcast.emit('notification', `User ${socket.id} has left the chat`);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO Server running on http://localhost:${PORT}`);
});
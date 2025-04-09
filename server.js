const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Güvenlik için sadece client domainini yazabilirsin
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Kullanıcı bağlandı:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Kullanıcı ${socket.id} odaya katıldı: ${roomId}`);
  });

  socket.on('audio-data', ({ roomId, data }) => {
    socket.to(roomId).emit('receive-audio', data);
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});

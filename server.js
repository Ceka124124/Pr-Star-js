const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Statik dosyaları sunma
app.use(express.static('public'));

// Socket.io bağlantısı
io.on('connection', (socket) => {
  console.log('Yeni bir kullanıcı bağlandı!');

  // Ses verisi alındığında
  socket.on('audio', (audioBlob) => {
    console.log('Ses verisi alındı!');
    // Ses verisini diğer kullanıcılara gönder
    socket.broadcast.emit('audio', audioBlob);
  });

  // Sohbet mesajı alındığında
  socket.on('message', (message) => {
    console.log('Mesaj alındı:', message);
    // Mesajı tüm kullanıcılara gönder
    io.emit('message', message);
  });

  // Bağlantı koparsa
  socket.on('disconnect', () => {
    console.log('Bir kullanıcı bağlantıyı kesti!');
  });
});

// Sunucuyu başlatma
server.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor...');
});

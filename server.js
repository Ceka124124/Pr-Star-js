const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  socket.on('voice', (data) => {
    socket.broadcast.emit('voice', data);
  });

  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Sesli sohbet sunucusu çalışıyor');
});

server.listen(3000, () => {
  console.log('Sunucu 3000 portunda çalışıyor');
});

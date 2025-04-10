const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // CORS modülünü ekle

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// CORS ayarlarını yap
app.use(cors());

// Statik dosyaların sunulması (HTML, CSS, JS)
app.use(express.static('public'));

// Anasayfaya gelen istekler için index.html dosyasını sunma
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

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

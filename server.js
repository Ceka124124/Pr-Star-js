// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Public klasörü üzerinden HTML dosyalarını sunalım
app.use(express.static('public'));

// Kullanıcı bağlandığında yapılacak işlemler
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    // Odaya katılmak için gelen istek
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`Kullanıcı ${socket.id} odasına katıldı: ${roomId}`);
    });

    // WebRTC sinyalleme verilerini yönlendirme
    socket.on('signal', (data) => {
        // Bağlantı kurulan oda ID'sine göre sinyal gönderiyoruz
        io.to(data.roomId).emit('signal', data);
    });

    // Kullanıcı bağlantısını kestiğinde yapılacak işlemler
    socket.on('disconnect', () => {
        console.log('Kullanıcı bağlantıyı kesti:', socket.id);
    });
});

// Sunucuyu başlatma
server.listen(3000, () => {
    console.log('Sunucu http://localhost:3000 adresinde çalışıyor');
});

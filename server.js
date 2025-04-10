const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Frontend dosyalarını public klasöründe bulunduracağız

io.on('connection', (socket) => {
    console.log('Yeni bir kullanıcı bağlandı');

    socket.on('offer', (offer) => {
        console.log('Offer alındı');
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        console.log('Answer alındı');
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        console.log('ICE Candidate alındı');
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('Kullanıcı bağlantısı kesildi');
    });
});

server.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
});

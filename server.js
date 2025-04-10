const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));  // Public klasöründe HTML, CSS ve JS dosyalarını kullanacak

// WebSocket bağlantısı
wss.on('connection', (ws) => {
    console.log('Yeni bir kullanıcı bağlandı!');
    
    // Ses verisi alındığında
    ws.on('message', (message) => {
        console.log('Mesaj alındı:', message);

        // Mesajı diğer kullanıcılara ilet
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);  // Ses verisini diğer kullanıcılara gönder
            }
        });
    });

    // Bağlantı koparsa
    ws.on('close', () => {
        console.log('Bir kullanıcı bağlantıyı kesti!');
    });
});

// Sunucuyu başlat
server.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor...');
});

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let currentKaraokeSong = null;
let karaokeHost = null;

app.get("/", (req, res) => {
  res.send("Sesli Karaoke Server Çalışıyor!");
});

// Bağlantı kurulduğunda
io.on("connection", (socket) => {
  console.log("Yeni bir kullanıcı bağlandı");

  // Şarkı seçildiğinde
  socket.on("song-selected", (videoId) => {
    console.log(`Bir kullanıcı şarkı seçti: ${videoId}`);

    // Karaoke başlatan kişiyi belirle
    if (!karaokeHost) {
      karaokeHost = socket.id;  // Şarkıyı ilk seçen kullanıcı başlatıcı olur
    }

    currentKaraokeSong = videoId;

    // Karaoke başlatan kişiye özel şarkı ID'si ile bildirim
    socket.emit("karaoke-start", videoId);

    // Diğer tüm kullanıcılara da şarkı başlatma bilgisi gönder
    socket.broadcast.emit("karaoke-start", videoId);
  });

  // Karaoke başlatıldığında sadece başlatan kişinin sesi duyulsun
  socket.on("start-karaoke", (videoId) => {
    if (socket.id === karaokeHost) {
      // Şarkıyı başlatan kişi, diğer kullanıcılar dinlesin
      io.emit("karaoke-start", videoId);
    } else {
      socket.emit("error", "Yalnızca karaoke başlatıcı şarkıyı okuyabilir.");
    }
  });

  // Bağlantı kesildiğinde
  socket.on("disconnect", () => {
    console.log("Bir kullanıcı ayrıldı");
    if (socket.id === karaokeHost) {
      karaokeHost = null;  // Karaoke başlatıcı ayrıldığında sıfırlanır
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});

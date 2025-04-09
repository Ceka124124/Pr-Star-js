const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Basit GET isteği, "Cannot GET /" hatasını da çözer
app.get("/", (req, res) => {
  res.send("Socket.io Voice Server is Running");
});

io.on("connection", (socket) => {
  console.log("Yeni bir kullanıcı bağlandı");

  // Ses verisini alıp diğer kullanıcılara yaymak
  socket.on("voice", (data) => {
    socket.broadcast.emit("voice", data);
  });

  // Video kontrolü için olaylar
  socket.on("video-sync", (data) => {
    socket.broadcast.emit("video-sync", data); // Video durumunu tüm kullanıcılarla senkronize et
  });

  // Bağlantı kesildiğinde kullanıcıyı bildir
  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı");
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // İzin verilen domainleri buraya ekleyebilirsiniz
    methods: ["GET", "POST"]
  }
});

let usersInRoom = {};  // Oda başına kullanıcılar

app.get("/", (req, res) => {
  res.send("Socket.io Voice Server is Running");
});

io.on("connection", (socket) => {
  console.log("Yeni kullanıcı: " + socket.id);

  // Odaya katılma
  socket.on("join-voice-room", (roomId) => {
    socket.join(roomId);

    // Kullanıcıyı odada sakla
    if (!usersInRoom[roomId]) {
      usersInRoom[roomId] = [];
    }
    usersInRoom[roomId].push(socket.id);

    // Odaya 2. kullanıcı gelirse ses iletimi başlat
    if (usersInRoom[roomId].length === 2) {
      console.log("İki kullanıcı bağlandı, ses başlatılıyor...");
      socket.to(roomId).emit("start-audio");
    }
    console.log(`Oda: ${roomId}, Kullanıcı Sayısı: ${usersInRoom[roomId].length}`);
  });

  // Mikrofon durumu
  socket.on("microphone-status", (data) => {
    console.log(`${data.userId} mikrofon durumu: ${data.status}`);
    if (data.status === "open") {
      socket.to(data.roomId).emit("microphone-open", data.userId);
    } else {
      socket.to(data.roomId).emit("microphone-closed", data.userId);
    }
  });

  // Kullanıcı ayrıldığında odadan çıkart
  socket.on("disconnect", () => {
    for (let roomId in usersInRoom) {
      const index = usersInRoom[roomId].indexOf(socket.id);
      if (index !== -1) {
        usersInRoom[roomId].splice(index, 1);
        console.log(`Kullanıcı ayrıldı: ${socket.id}, Oda: ${roomId}`);
      }

      // Eğer oda boşsa, odayı sil
      if (usersInRoom[roomId].length === 0) {
        delete usersInRoom[roomId];
      }
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Socket.io Voice Server is Running on port ${port}`);
});

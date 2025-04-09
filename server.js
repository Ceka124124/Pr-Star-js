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

let users = [];

app.get("/", (req, res) => {
  res.send("Socket.io Voice Server is Running");
});

io.on("connection", (socket) => {
  console.log("Yeni kullanıcı: " + socket.id);

  socket.on("join-voice-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("new-user", (userId) => {
    users.push({ userId, socketId: socket.id });
  });

  socket.on("microphone-status", (data) => {
    console.log(`${data.userId} mikrofon durumu: ${data.status}`);
  });

  socket.on("dice-roll", (data) => {
    let winner = null;
    const rollResults = users.map(user => {
      return { userId: user.userId, roll: Math.floor(Math.random() * 6) + 1 };
    });
    
    // Kazanan belirleme
    winner = rollResults.reduce((prev, current) => (prev.roll > current.roll) ? prev : current);
    
    // Sonucu tüm kullanıcılara gönder
    io.to(socket.id).emit("dice-roll-result", { winner: winner.userId });
    io.to(winner.socketId).emit("dice-roll-result", { winner: winner.userId });
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı: " + socket.id);
    users = users.filter(user => user.socketId !== socket.id);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Socket.io Voice Server is Running on port ${port}`);
});

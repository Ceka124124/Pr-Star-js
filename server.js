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

  // Kullanıcı odaya katıldığında
  socket.on("join-voice-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  // Yeni kullanıcı kaydedildiğinde
  socket.on("new-user", (userId) => {
    users.push({ userId, socketId: socket.id });
  });

  // Kullanıcı ayrıldığında
  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı: " + socket.id);
    users = users.filter(user => user.socketId !== socket.id);
    // Odayı terk eden kullanıcının ayrıldığını diğer kullanıcılara bildir
    socket.broadcast.emit("user-left", socket.id);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Socket.io Voice Server is Running on port ${port}`);
});

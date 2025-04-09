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

app.get("/", (req, res) => {
  res.send("Socket.io Voice Server is Running");
});

io.on("connection", (socket) => {
  console.log("Yeni kullanıcı: " + socket.id);

  socket.on("join-voice-room", (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);

    // OFFER
    socket.on("offer", (data) => {
      io.to(data.to).emit("offer", { from: socket.id, offer: data.offer });
    });

    // ANSWER
    socket.on("answer", (data) => {
      io.to(data.to).emit("answer", { from: socket.id, answer: data.answer });
    });

    // ICE CANDIDATE
    socket.on("candidate", (data) => {
      io.to(data.to).emit("candidate", { from: socket.id, candidate: data.candidate });
    });

    // Ayrıldığında
    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-left", socket.id);
    });
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Socket.io Voice Server is Running on port ${port}`);
});

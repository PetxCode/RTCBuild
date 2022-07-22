const express = require("express");
const app = express();
const port = 2344;
const http = require("http");
const server = http.createServer(app);

const room = {};

const { Server } = require("socket.io");
const io = new Server(server, { cors: "*" });

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join room", (roomID) => {
    if (room[roomID]) {
      room[roomID].push(socket.id);
    } else {
      room[roomID] = socket.id;
    }

    const otherUser = room[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

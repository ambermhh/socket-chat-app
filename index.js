const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

const nicknames = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

io.on("connection", (socket) => {

  socket.on("disconnect", () => {
    // nicknames[socket.id] = nickname;
    // socket.broadcast.emit("userJoined",`${nickname} has left the chat`);
    // console.log(nicknames);
  });

  socket.on("nickname", (nickname) => {
    nicknames[socket.id] = nickname;
    socket.broadcast.emit("userJoined",`${nickname} has joined the chat`);
    socket.broadcast.emit("disconnected",`${nickname} has left the chat`);

    console.log(nicknames);
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    const nickname = nicknames[socket.id] || "Anonymous";
    console.log(nickname);
    const formattedMessage = `${nickname}: ${msg}`;
    io.emit("chat message", formattedMessage);
  });
  socket.on("typing", (nickname, msg) => {
    io.emit(`${nickname} is typing...` + msg);
    console.log("typing");
  });
  socket.on("stop typing", (msg) => {
    io.emit("stop typing", msg);
  });
});

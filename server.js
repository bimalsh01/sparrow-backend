require("dotenv").config(); // for database
const express = require('express');
const router = require("./routes")
const app = express();
const cors = require("cors");
const socket = require("socket.io")
const DbConnect = require("./database");
app.use(express.json({ limit: '50mb' }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000","http://localhost:3000"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};



app.use(cors(corsOptions));

// for static image loading
app.use(express.static("storage"));
const PORT = process.env.PORT || 5500;



app.use(router);

app.get("/", (req, res) => {
  res.send("Hello World");
})


const server = require("http").createServer(app);
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    const dataToSend = {
      from: data.from,
      to: data.to,
      text: data.msg,
    }
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("new-msg", dataToSend);
    }
  });


})


DbConnect();
require("dotenv").config(); // for database
const express = require('express');
const router = require("./routes")
const app = express();
const cors = require("cors");
const socket = require("socket.io")
const DbConnect = require("./database");
const cloudinary = require("cloudinary");
app.use(express.json({ limit: '50mb' }));

const cookieParser = require("cookie-parser");
const path = require("path");
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

cloudinary.config({ 
  cloud_name: 'kingsly', 
  api_key: '368993726257699', 
  api_secret: 't7wlk7UbEkBn--lCB4OhDJ-E4_U' 
});


app.use(cors(corsOptions));

// for static image loading
app.use("/storage", express.static(path.join(__dirname + "/storage")))
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
    console.log("userId", userId);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log("Socket Message Received: ", data);
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
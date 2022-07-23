require("dotenv").config(); // for database
const express = require('express');
const router = require("./routes")
const app = express();
const cors = require("cors");
const socket = require("socket.io")
const DbConnect = require("./database");
const cloudinary = require("cloudinary");
app.use(express.json({ limit: '50mb' }));
const ACTIONS = require("./action");

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

// Database Connection
DbConnect();

app.use(cors(corsOptions));

// for static image loading
app.use("/storage", express.static(path.join(__dirname + "/storage")))
const PORT = process.env.PORT || 5500;



app.use(router);

app.get("/", (req, res) => {
  res.send({ message: "Welcome to Sparrow" });
})


const server = require("http").createServer(app);

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  }
})

// for message with socket
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log("Socket user  CONNECTED", userId);
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

// for join room with socket

const socketUserMapping = {};

io.on("connection", (socket) => {
  console.log("New Connection", socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;

    // Getting all user from rooms or get empty array
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user
      });
      // FOR own emit
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId]
      });
    });

    socket.join(roomId);
  });


  // Handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  console.log('Upto here')

  // HAndle relay sdp (session desc)
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    })
    console.log("Hello", sessionDescription);
  });

  // Mute and unmute
  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      })
    })
  });

  socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach(clientId => {
      io.to(clientId).emit(ACTIONS.UN_MUTE, {
        peerId: socket.id,
        userId,
      })
    })
  });

  // LEaving room
  const leaveRoom = ({ roomId }) => {
    const { rooms } = socket;
    Array.from(rooms).forEach(roomId => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
      clients.forEach(clientId => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id,
        })

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping[socket.id]?.id,
        });
      });
      socket.leave(roomId)
    });
    delete socketUserMapping[socket.id];

  }
  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on('disconnecting', leaveRoom)

});



module.exports = server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

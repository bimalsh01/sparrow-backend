require("dotenv").config(); // for database
const express = require('express');
const router = require("./routes")
const app = express();
const cors = require("cors");
const DbConnect = require("./database");
app.use(express.json({limit:'50mb'}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };



app.use(cors(corsOptions));

// for static image loading
app.use(express.static("storage"));

const PORT = process.env.PORT || 5500;



app.use(router);

app.get("/",(req,res) =>{
    res.send("Hello World");
})


const server = require("http").createServer(app);
server.listen(PORT,() => console.log(`Server is running on port ${PORT}`));
DbConnect();
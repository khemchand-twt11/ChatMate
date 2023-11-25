const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser"); // authenticating through cookie
const connection = require("./config/db"); // connection to mongodb atlas
const userRoute = require("./routes/user.route");
require("dotenv").config();
const http = require("http");

const PORT = process.env.PORT || 8000;

//ROUTES
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use(
  express.json({
    limit: "5mb",
  }),
);
app.use(cookieParser());

const server = http.createServer(app);

const io = require("socket.io")(server);

// check the connection of socket from client
let onlineUsers = [];
io.on("connection", (socket) => {
  // socket events will be here
  socket.on("join-room", (userId) => {
    socket.join(userId);
  });

  // send message to clients (who are present in members array)
  socket.on("send-message", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message);
  });

  // clear unread messages
  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("unread-messages-cleared", data);
  });

  // typing event
  socket.on("typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
  });

  // online users

  socket.on("came-online", (userid) => {
    if (!onlineusers.includes(userid)) {
      onlineusers.push(userid);
    }

    io.emit("online-users-updated", onlineusers);
  });

  socket.on("went-offline", (userid) => {
    onlineusers = onlineusers.filter((user) => user !== userid);
    io.emit("online-users-updated", onlineusers);
  });
});

// main routes

app.use("/user", userRoute);

app.use("/",(req,res)=>{
  res.send({msg:"server is running...."})
})
//listen
server.listen(PORT, async () => {
  try {
    await connection();
    console.log("connected to db at port", PORT);
  } catch (error) {
    console.log("error connecting to database");
  }
});

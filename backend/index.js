const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const connection = require("./config/db");
const userRoute = require("./routes/user.route");
require("dotenv").config();
const http = require("http");
const ws = require("ws");
const PORT = process.env.PORT || 8000;

//ROUTES

// app.use(cors());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/user", userRoute);

const server = http.createServer(app);

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  const token = req.headers.cookie?.split("=")[1];
  console.log(token);
  console.log("connected");
  connection.send("hii");
});

//listen
server.listen(PORT, async () => {
  try {
    await connection();
    console.log("connected to db at port", PORT);
  } catch (error) {
    console.log("error connecting to database");
  }
});

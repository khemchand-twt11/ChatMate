const express = require("express");
const cors = require("cors");
const app = express();

const connection = require("./config/db");
const userRoute = require("./routes/user.route");
require("dotenv").config();
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

app.use("/user", userRoute);

//listen
app.listen(PORT, async () => {
  try {
    await connection();
    console.log("connected to db at port", PORT);
  } catch (error) {
    console.log("error connecting to database");
  }
});

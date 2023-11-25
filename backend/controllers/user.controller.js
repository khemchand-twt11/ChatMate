const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/authUtils");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const Register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const ifUseExists = await userModel.findOne({ email });
    if (ifUseExists)
      return res
        .status(409)
        .json({ message: "user with same credentials already registered!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = await generateToken(createdUser._id, username);
    res
      .cookie("chatmateToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      })
      .status(201)
      .json({
        id: createdUser._id,
        username,
        message: "User registered successfully",
      });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong at Server" });
  }
};

const UserProfile = (req, res) => {
  const token = req.cookies?.chatmateToken;
  console.log(token);
  if (token) {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) return res.json({ error: err.message });
      res.status(200).json(decoded);
    });
  } else {
    res.status(401).json({ message: "no token provided" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user)
      return res
        .status(401)
        .json({ message: "User Does not exists with this email id" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ message: "Incorrect Password" });

    const token = await generateToken(user._id, user.username);

    res
      .cookie("chatmateToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({
        id: user._id,
        username: user.username,
        message: "User Login successfully",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong at the server side" });
  }
};

module.exports = { Register, UserProfile, Login };

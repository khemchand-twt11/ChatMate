const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
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

    // Generate a token

    /*
      jwt.sign(payload,SECRET,options,callback)
    */
    jwt.sign(
      { userId: createdUser._id, username },
      jwtSecret,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          // Handle token generation error
          return res.status(500).json({ error: "Failed to generate token" });
        }

        // Set the token in a cookie
        res
          .cookie("token", token, {
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
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong at Server" });
  }
};

const UserProfile = (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    // console.log(token);
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) throw err;
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

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    jwt.sign(
      { userId: user._id, username: user.username },
      jwtSecret,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to generate token", error: err.message });
        }

        res
          .cookie("token", token, {
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
      }
    );
  } catch (error) {
    // Handle any other errors that may occur
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { Register, UserProfile, Login };

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate a token
    jwt.sign(
      { userId: createdUser._id },
      process.env.JWT_SECRET,
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
            message: "User registered successfully",
          });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Something went wrong at Server" });
  }
};

module.exports = { Register };

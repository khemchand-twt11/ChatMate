const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const generateToken = (userId, username) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId, username },
      jwtSecret,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = generateToken;

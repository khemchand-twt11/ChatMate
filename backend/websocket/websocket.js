const ws = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
function createWebSocketServer(server) {
  const wss = new ws.WebSocketServer({ server });

  wss.on("connection", (connection, req) => {
    const cookies = req.headers.cookie;

    if (cookies) {
      const tokenCookieString = cookies
        .split(";")
        .find((str) => str.startsWith("token="));

      if (tokenCookieString) {
        const token = tokenCookieString.split("=")[1];
        if (token) {
          jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) throw err;
            console.log(userData);
            const { userId, username } = userData;
            connection.userId = userId;
            connection.username = username;
          });
        }
      }
    }

    // console.log(wss.clients);
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        })
      );
    });
    // console.log([...wss.clients].map((c) => c.username));
  });
}

module.exports = createWebSocketServer;

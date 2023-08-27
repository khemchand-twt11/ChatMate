const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const connection = require('./config/db')
const userRoute = require('./routes/user.route')
require('dotenv').config()
const http = require('http')
const createWebSocketServer = require('./websocket/websocket')

const PORT = process.env.PORT || 8000

//ROUTES
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
)
app.use(
  express.json({
    limit: '50mb',
  })
)
app.use(cookieParser())

const server = http.createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})
// check the connection of socket from client
let onlineUsers = []
io.on('connection', (socket) => {
  // socket events will be here
  socket.on('join-room', (userId) => {
    socket.join(userId)
  })

  // send message to clients (who are present in members array)
  socket.on('send-message', (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit('receive-message', message)
  })

  // clear unread messages
  socket.on('clear-unread-messages', (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit('unread-messages-cleared', data)
  })

  // typing event
  socket.on('typing', (data) => {
    io.to(data.members[0]).to(data.members[1]).emit('started-typing', data)
  })

  // online users

  socket.on('came-online', (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId)
    }

    io.emit('online-users-updated', onlineUsers)
  })

  socket.on('went-offline', (userId) => {
    onlineUsers = onlineUsers.filter((user) => user !== userId)
    io.emit('online-users-updated', onlineUsers)
  })
})

app.use('/user', userRoute)
//listen
server.listen(PORT, async () => {
  try {
    await connection()
    console.log('connected to db at port', PORT)
  } catch (error) {
    console.log('error connecting to database')
  }
})

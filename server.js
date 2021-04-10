const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const BOT_NAME = 'ChatCord';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcome current user
    socket
      .to(user.room)
      .emit('message', formatMessage(BOT_NAME, `Hey ${user.username}, Welcome to ChatCord`));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(BOT_NAME, 'A user has joined the chat'));

    // Send users 
  });


  // Broadcast when a user disconnects
  socket.on('disconnect', () => {
    const user = getCurrentUser(socket.id);
    userLeave(socket.id)

    if (user) {
      io
      .to(user.room)
      .emit('message', formatMessage(BOT_NAME, `${user.username} has left the chat`));
    }
    
  });

  // Listen for chat message
  socket.on('chatMessage', message => {
    const user = getCurrentUser(socket.id);

    io
      .to(user.room)
      .emit('message', formatMessage(user.username, message));
  });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
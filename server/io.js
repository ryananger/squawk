const {Server} = require('socket.io');

let io;

var initSocket = function(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket)=>{
    socket.on('joinChat', (chatId)=>{
      socket.join(chatId);
    });
  });
};

var getIO = function() {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }

  return io;
};

exports.initSocket = initSocket;
exports.getIO = getIO;
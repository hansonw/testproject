const constants = require('../common/constants');
const http = require('http');

const PLAY_DELAY_MS = 5000;

function createSocketServer(expressServer) {
  let server = http.Server(expressServer);

  let clients = {};
  let ready = {};

  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log('a user connected');
    ready[socket.id] = false;
    clients[socket.id] = socket;

    socket.on(constants.ClientActions.TIME_REQUEST, () => {
      socket.emit(constants.ServerActions.TIME_RESPONSE, {
        time: Date.now(),
      });
    });

    socket.on(constants.ClientActions.CLIENT_READY, () => {
      ready[socket.id] = true;
      let clientIds = Object.keys(clients);
      for (let id of clientIds) {
        if (!ready[id]) {
          return;
        }
      }

      // Start in 5 seconds!
      let startTime = Date.now() + PLAY_DELAY_MS;
      for (let id of clientIds) {
        clients[id].emit(constants.ServerActions.PLAY_SONG, {startTime});
      }
    });
  });

  return server;
}

module.exports = createSocketServer;

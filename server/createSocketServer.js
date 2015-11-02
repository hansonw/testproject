const constants = require('../common/constants');
const http = require('http');

const PLAY_DELAY_MS = 5000;

let clients = {};
let ready = {};

function checkReady() {
  let clientIds = Object.keys(clients);
  if (clientIds.length < 2) {
    return;
  }

  for (let id of clientIds) {
    if (!ready[id]) {
      return;
    }
  }

  // Start in 5 seconds!
  let startTime = Date.now() + PLAY_DELAY_MS;
  console.log('starting at %d!', startTime);
  for (let id of clientIds) {
    clients[id].emit(constants.ServerActions.PLAY_SONG, {startTime});
    ready[id] = false;
  }
}

function createSocketServer(expressServer) {
  let server = http.Server(expressServer);

  const io = require('socket.io')(server);
  io.on('connection', (socket) => {
    console.log('user %s connected', socket.id);
    ready[socket.id] = false;
    clients[socket.id] = socket;

    socket.on('disconnect', () => {
      console.log('user %s disconnected', socket.id);
      delete ready[socket.id];
      delete clients[socket.id];
      checkReady();
    });

    socket.on(constants.ClientActions.TIME_REQUEST, () => {
      socket.emit(constants.ServerActions.TIME_RESPONSE, {
        time: Date.now(),
      });
    });

    socket.on(constants.ClientActions.CLIENT_READY, () => {
      ready[socket.id] = true;
      console.log('client %s ready', socket.id);
      checkReady();
    });
  });

  return server;
}

module.exports = createSocketServer;

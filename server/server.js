'use strict';

const express = require('express');
const http = require('http');
const path = require('path');

let server = express();

const BASEDIR = __dirname + '/../';

server.get('/', (req, res) => {
  res.sendFile(path.join(BASEDIR + 'html/index.html'));
});

server.use(express.static(BASEDIR + 'build'));
server.use(express.static(BASEDIR + 'static'));

server = http.Server(server);

const io = require('socket.io')(server);
io.on('connection', (_socket) => {
  console.log('a user connected');
});

module.exports = server;

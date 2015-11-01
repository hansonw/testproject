'use strict';

const express = require('express');
const path = require('path');

const server = express();

const BASEDIR = __dirname + '/../';

server.get('/', (req, res) => {
  res.sendFile(path.join(BASEDIR + 'html/index.html'));
});

server.use(express.static(BASEDIR + 'build'));
server.use(express.static(BASEDIR + 'static'));

module.exports = server;

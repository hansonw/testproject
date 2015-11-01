require('babel/register');

const server = require('./server/server.js');

server.listen(80, function() {
  console.log('Server started');
});

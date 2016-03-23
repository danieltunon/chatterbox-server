var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

var port = 3000 || process.env.PORT || 8080;
var clientDirname = '/Users/student/Codes/chatterbox-server-liberated/client';
var serverDirname = '/Users/student/Codes/chatterbox-server-liberated/server';

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

app.use(function(req, res, next) {
  res.header(headers);
  next();
});

app.use(express.static(clientDirname));

io.on('connection', function(socket) {

  fs.readFile(serverDirname + '/data/data.json', 'utf8', function(err, data) {
    io.emit('send chats', JSON.parse(data.trim()));
  });

  socket.on('submit', function(message) {
    var storedMessages;
    fs.readFile(serverDirname + '/data/data.json', 'utf8', function(err, data) {
      storedMessages = JSON.parse(data.trim());
      storedMessages.results.unshift(message);
      io.emit('send chats', storedMessages);
      fs.writeFile(serverDirname + '/data/data.json', JSON.stringify(storedMessages), 'utf8', function(err) {
        if (err) {
          throw err;
        }
        console.log('It\'s saved!');
      });
    });
  });

});

app.options('/classes/messages', function (req, res) {
  headers['Allow'] = 'GET,POST,OPTIONS';
  res.set(headers);
  res.send('options allowed');
});

server.listen(port, function () {
  console.log('Example socket server listening on port:' + port);
});


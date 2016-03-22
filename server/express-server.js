var express = require('express');
var app = express();
var fs = require('fs');

var port = process.env.PORT || 8080;
var clientDirname = '/app/client';
var serverDirname = '/app/server';

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

app.get('/classes/messages', function (req, res) {
  fs.readFile(serverDirname + '/data/data.json', 'utf8', function(err, data) {
    res.status(200).json(JSON.parse(data));
  });
});

app.post('/classes/messages', function (req, res) {
  var incomingMessage = '';
  req.on('data', function(chunk) {
    incomingMessage += chunk;
  });
  req.on('end', function() {
    var storedMessages;
    fs.readFile(serverDirname + '/data/data.json', 'utf8', function(err, data) {
      storedMessages = JSON.parse(data.trim());
      storedMessages.results.unshift(JSON.parse(incomingMessage.trim()));
      res.json(storedMessages);

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

app.listen(port, function () {
  console.log('Example app listening on port 80!');
});


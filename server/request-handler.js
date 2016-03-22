var fs = require('fs');
var path = require('path');


var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  var dirname = '/Users/danny/Programming/HackReactor/chatterbox-server/client/';

  // gross floating storage object
  global.storage = global.storage || { results: [ { objectId: 1, username: 'danny', message: 'poo' }, { objectId: 2, username: 'skye', message: 'hai' } ] };

  if (request.method === 'GET') {
    if (request.url === '/' || /\?username=.*/.test(request.url)) {
      headers['Content-Type'] = 'text/html';

      fs.readFile(dirname + 'refactor.html', 'utf8', function(err, data) {
        if (err) {
          throw err;
        }
        response.writeHead(statusCode, headers);
        response.end(data);
      });


    } else if (/css$/.test(request.url)) {

      headers['Content-Type'] = 'text/css';
      response.writeHead(statusCode, headers);
      fs.createReadStream(dirname + request.url, 'utf8').pipe(response);

    } else if (/jquery\.js$/.test(request.url)) {
      headers['Content-Type'] = 'text/javascript';
      response.writeHead(statusCode, headers);
      var stream = fs.createReadStream(dirname + request.url, 'utf8');
      stream.pipe(response);

    } else if (/underscore\.js$/.test(request.url)) {
      headers['Content-Type'] = 'text/javascript';
      response.writeHead(statusCode, headers);
      var stream = fs.createReadStream(dirname + request.url, 'utf8');
      stream.pipe(response);

    } else if (/example\.js$/.test(request.url)) {
      headers['Content-Type'] = 'text/javascript';
      response.writeHead(statusCode, headers);
      var stream = fs.createReadStream(dirname + request.url, 'utf8');
      stream.pipe(response);

    } else if (/backbone\.js$/.test(request.url)) {
      headers['Content-Type'] = 'text/javascript';
      response.writeHead(statusCode, headers);
      var stream = fs.createReadStream(dirname + request.url, 'utf8');
      stream.pipe(response);

    } else if (/refactor\.js$/.test(request.url)) {
      headers['Content-Type'] = 'text/javascript';
      response.writeHead(statusCode, headers);
      var stream = fs.createReadStream(dirname + request.url, 'utf8');
      stream.pipe(response);

    } else if (/46\.gif$/.test(request.url)) {
      headers['Content-Type'] = 'image/gif';
      response.writeHead(statusCode, headers);
      var stream = fs.createReadStream(dirname + request.url);
      stream.pipe(response);

    } else if (request.url === '/classes/messages') {
      console.log('...getting messages');

      headers['Content-Type'] = 'text/json';
      response.writeHead(statusCode, headers);
      fs.readFile('/Users/danny/Programming/HackReactor/chatterbox-server/server/data/data.json', 'utf8', function(err, data) {
        response.end(data.trim());     // TODO: replace with fs.readFile(data.json)
      });
    } else if (request.url === '/classes/rooms') {
      console.log('...getting rooms');

      headers['Content-Type'] = 'text/json';
      response.writeHead(statusCode, headers);
      response.end(someData);
    } else {
      headers['Content-Type'] = 'text/plain';
      response.writeHead(404, headers);
      response.end('Page not found');
    }
  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages') {
      console.log('...posting your message');
      headers['Content-Type'] = 'text/json';
      response.writeHead(201, headers);

      var incomingMessage = '';
      request.on('data', function(chunk) {
        incomingMessage += chunk;
      });

      request.on('end', function() {
        var storedMessages;
        fs.readFile('/Users/danny/Programming/HackReactor/chatterbox-server/server/data/data.json', 'utf8', function(err, data) {

          storedMessages = JSON.parse(data.trim());
          storedMessages.results.unshift(JSON.parse(incomingMessage.trim()));
          response.end(JSON.stringify(storedMessages));

          fs.writeFile('/Users/danny/Programming/HackReactor/chatterbox-server/server/data/data.json', JSON.stringify(storedMessages), 'utf8', function(err) {
            if (err) {
              throw err;
            }
            console.log('It\'s saved!');
          });
        });

        // storage.results.unshift(JSON.parse(incomingMessage));
      });

    } else if (request.url === '/classes/rooms') {
      console.log('...posting a room');

      headers['Content-Type'] = 'text/json';
      response.writeHead(statusCode, headers);
      // response will be entire storage object
      response.end(someData);
    } else {
      headers['Content-Type'] = 'text/plain';
      response.writeHead(404, headers);
      response.end('Page not found');
    }
  } else if (request.method === 'OPTIONS') {
    // OPTIONS response
    headers['Content-Type'] = 'text/plain';
    headers['Allow'] = 'GET,POST,OPTIONS';
    response.writeHead(statusCode, headers);
    response.end();

  } else {
    // error
    response.writeHead(404, headers);
    response.end('Bad server request');
  }


};

// These headers will allow Cross-Origin Resource Sharing (CORS).
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports = requestHandler;

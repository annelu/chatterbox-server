
/* * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

//NODE MODULES
 var url = require('url');
 var fs = require('fs');

//Where we store our messages
 var messages = [];


 var handleRequest = function(request, response) {
  var toSend = "";
  var statusCode= 404;
  // var requestURL = request.url.split("/").slice(1);
  var urlObject = url.parse(request.url);
  var requestURL = urlObject.pathname.split('/');
  console.log(requestURL);

  /* Without this line, this server wouldn't work. See the note below about CORS. */
  var headers = defaultCorsHeaders;

  console.log("Serving request type " + request.method + " for url " + request.url);

  if (requestURL[1] === 'classes') {

    if (request.method === "GET"){
      // headers['Content-Type'] = 'application/json';
      // statusCode = 200;
      // toSend= JSON.stringify(messages);
      // response.writeHead(statusCode, headers);
      // response.end(toSend);

      fs.readFile('messages.txt', {encoding: 'utf8'},function(err, json){
        if (err) {throw err;}
        response.writeHeader(200, {'Content-Type': 'application/json'});
        console.log(json);
        response.write(JSON.stringify(json));
        response.end();
      });
    }

    if (request.method === "POST"){
      statusCode = 201;
      headers['Content-Type'] = 'application/json';
      var fullbody = '';

      request.on('data', function(chunk){
        fullbody += chunk;
      });

      request.on('end', function(){
        // fullbody = JSON.parse(fullbody);
        toSend = JSON.stringify(messages);
        fs.appendFile('messages.txt', fullbody, function(err) {
          if (err) {throw err;}
        });
        response.writeHead(statusCode, headers);
        response.end(toSend);
      });
    }

  }

  else if (requestURL[1] === "" && request.method === "GET"){
    fs.readFile('../client/index.html', function(err, html) {
      if (err) {
        throw err;
      }
      response.writeHeader(200, {'Content-Type': 'text/html'});
      response.write(html);
      response.end();
    });
  }

  else if (requestURL[1] === "scripts" && request.method === "GET"){ //Fix This line
    var file = requestURL[2];
    console.log(file);
    fs.readFile('../client/scripts/'+file, function(err, js) {
      if (err) {
        throw err;
      }
      response.writeHeader(200, {'Content-Type': 'text/javascript'});
      response.write(js);
      response.end();
    });
  }

  else if (requestURL[1] === "styles" && request.method === "GET"){ //Fix This line
    var file = requestURL[2];
    console.log(file);
    fs.readFile('../client/styles/'+file, function(err, css) {
      if (err) {
        throw err;
      }
      response.writeHeader(200, {'Content-Type': 'text/css'});
      response.write(css);
      response.end();
    });
  }
};

exports.handleRequest = handleRequest;

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

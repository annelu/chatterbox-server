/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
 var url = require('url');

 var messages = [];

 var handleRequest = function(request, response) {
  var toSend = "";
  var statusCode= 404;
  // var requestURL = request.url.split("/").slice(1);
  var urlObject = url.parse(request.url);
  var requestURL = urlObject.pathname.split('/');
  console.log(requestURL);

  /* Without this line, this server wouldn't work. See the note
  * below about CORS. */
  var headers = defaultCorsHeaders;

  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
  * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  // console.log(request.url);
  // console.log(request);

  console.log("Serving request type " + request.method + " for url " + request.url);

  if (requestURL[1] === 'classes') {

    if (request.method === "GET"){
      headers['Content-Type'] = 'application/json';
      statusCode = 200;
      toSend= JSON.stringify(messages);
      response.writeHead(statusCode, headers);
      response.end(toSend);
    }

    if (request.method === "POST"){
      statusCode = 201;
      headers['Content-Type'] = 'application/json';
      var fullbody = '';

      request.on('data', function(chunk){
        fullbody += chunk;
      });

      request.on('end', function(){
        fullbody = JSON.parse(fullbody);
        messages.push(fullbody);
        toSend = JSON.stringify(messages);
        response.writeHead(statusCode, headers);
        response.end(toSend);
      });
    }

  }

  else if (requestURL[1] === "" && request.method === "GET"){
    headers['Content-Type'] = 'text/html';
    statusCode = 200;
    toSend = "<div>This is some html </div>";
    response.writeHead(statusCode, headers);
    response.end(toSend);
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

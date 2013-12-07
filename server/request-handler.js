/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */



var handleRequest = function(request, response) {
  var messages = [];
  var toSend = "";
  var statusCode= 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  // console.log(request.url);
  // console.log(request);

  console.log("Serving request type " + request.method + " for url " + request.url);

  //HANDLE GETS
  if (request.method === "GET"){
    statusCode = 200;
    if(request.url === '/classes/messages'){
      toSend= messages;
    }
    toSend= messages;
  }

  //HANDLE POSTS
  else if (request.method === "POST"){
    statusCode = 201;
    var fullbody = '';
    request.on('data', function(chunk){
      // var newMsg = 
      fullbody += chunk;
      // console.log(typeof process.stdout.write(chunk));
      // console.log(typeof newMsg);
      // messages.push(newMsg);
    });
    request.on('end', function(){
      fullbody = JSON.parse(fullbody);
      messages.push(fullbody);
    });
  }

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/

  response.end(JSON.stringify(toSend));
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

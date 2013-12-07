$(document).ready(function(){

  getMessages();

  $('.currentRoom').text(currentRoom);
  // $('.userFocus').text(userFocus);
  getMessages();


  $('button').on('click', function(){
    var userMessage = $('.newMsg').val().toString();
    sendMessage(userMessage);
  });


  // $('.reset').on('click', function(){
  //   getMessages();
  //   userFocus= 'All';
  //   currentRoom = 'Lobby';
  //   $('.currentRoom').text(currentRoom);
  //   $('.userFocus').text(userFocus);
  // });


//Clicking on username
  $('#left').on('click','.username',function(){
    befriended.push($(this).text());
    // $('.userFocus').text(userFocus);
    $('#friendList').append('<li><a href="#"</a></li>').text(userFocus);
    $friendUser = $( "div.username:contains("+ userFocus +") ").addClass('friend');
    $friendUser.siblings('.text').addClass('friend');
  });

//Clicking on Room Name
  $('.container').on('click','.roomname',function(){
    currentRoom = $(this).text();
    $('.currentRoom').text(currentRoom);
    $rooms = $( "div.roomname:contains("+ currentRoom +") ").parent().addClass('keep');
    $('.message').not('.keep').fadeOut();
    console.log($rooms);
  });
});



//GLOBALS

var userName=''; // grab this from the prompt
var befriended= [];
var currentRoom = 'Lobby';
var listOfMessages = [];
var mostRecentUpdate = '';
var characterLimits = {
  'objectId': 24,
  'roomname': 30,
  'text':140,
  'updatedAt': 24,
  'username': 50
};

var messageFields = [
  'username',
  'roomname',
  'text',
  'createdAt',
  'updatedAt',
  'objectId'
];

// HELPER FUNCTIONS


//RETRIEVING MESSAGES

var getMessages = function(){
  console.log('getting messages');
  $.ajax({
    // always use this url
    // url: 'https://api.parse.com/1/classes/chatterbox',
    url: 'http://127.0.0.1:8080/messages',
    type: 'GET',
    // contentType: 'application/json',
    // contentType: 'text/plain',
    // crossDomain:true,
    // data: {"order" :"-createdAt"},
    // {"where": {
    //       "objectId":"teDOY3Rnpe"
    //       // "order":"-createdAt"
    //     }
    //   },
    success: function (data) {
      // data = JSON.parse(data);
      listOfMessages = [];
      _.each(data, function(messageJSON){
        renderMessage(messageJSON);
      });
      printMessages(listOfMessages);
    },
    error: function (data,b,c) {
      console.log(data,b,c);
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message. Will try again in 2sec');
    }
  });
};


var renderMessage = function(messageJSON){
  var $messageNode = $('<div></div>');
  $messageNode.addClass('message');
  _.each(messageFields, function(val, i) {
    var content = messageJSON[messageFields[i]];
    if(content){
      content = content.slice(0,characterLimits[messageFields[i]]);
      if (val.charCodeAt(0) > 150) return;
    }
    // if (messageFields[i] === "username" || messageFields[i] === "roomname"){
    //   $('<div></div>')
    //     .addClass(messageFields[i])
    //     .append('<a href="#"></a>')
    //     .text(content)
    //     .appendTo($messageNode);
    // } else {
    $('<div></div>')
      .addClass(messageFields[i])
      .text(content)
      .appendTo($messageNode);
    // }
  });
  listOfMessages.push($messageNode);
};

var printMessages = function(listOfMessages){
  $('.message').remove();
  _.each(listOfMessages, function(msgNode, i) {
      $('#left').append(msgNode);
  });
};


// SUBMITTING MESSAGES

var composeMessage = function(userText) {
  var sendJSON = {};
  userName = window.location.search;
  userName = userName.split('=')[1];
  sendJSON.username = userName;
  sendJSON.text = userText;
  sendJSON.roomname = currentRoom;
  return sendJSON;
};


var sendMessage = function(input) {
  var toSend = composeMessage(input);
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(toSend),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      $('.newMsg').val("  ");
      getMessages();
      // setTimeout(getMessages,5000);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      alert('Chatterbox failed to send message. Please Try Again.');
      // setTimeout(getMessages,5000);
    }
  });
};

// var changeRoom = function() {
//   grabUserInput();
  
//   updateRoomName();
  
//   getMessagesForRoom();
// };














/// XSS /// 

var evilMessage = function(userText) {
  var evilJSON = {};
  userName = window.location.search;
  userName = userName.split('=')[1];
  evilJSON.userName = userName;
  // evilJSON['\<script\>window.location.reload\<\/script\>'] = true;
  evilJSON.script = "$('body').css('color','white')";
  evilJSON.style = "font-size=600px;";
  evilJSON.text = userText;
  evilJSON.roomname = '4chan';
  return evilJSON;
};

var evilSend = function(input) {
  var toSend = evilMessage(input);
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(toSend),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};


// Object {results: Array[100]}
// results: Array[100]
// 0: Object
// createdAt: "2013-10-07T16:22:03.280Z"
// objectId: "teDOY3Rnpe"
// roomname: "lobby"
// text: "hello"
// updatedAt: "2013-10-07T16:22:03.280Z"
// username: "gary"
// message: 

// var message = {
//   'username': 'shawndrost',
//   'text': 'trololo',
//   'roomname': '4chan'
// };


// get JSON

// post to Parse

// discect the Parse response

// construct message DOMs from parts of ParseObj




// eventually: 
// autoupdate - get new messages on some set interval and ignore old messages

// look @ user pages 
//

// ChatterBox.prototype.getMessages = function(){
//   $.ajax({
//     // always use this url
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'GET',
//     contentType: 'application/json',

//     success: function (data) {
//       this.renderMessage();
//       _.each(data.results, function(messageJSON){
//         renderMessage.call(that, messageJSON);
//         console.log('got some messages, ', messageJSON); //debugging
//       });
//     },

//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to get message');
//     }
//   });
// };

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var router = require('./server/model_routes');
var mongoose = require('mongoose');
var path = require('path');
var compression = require('compression');
var TARGET = process.env.npm_lifecycle_event;
var PORT = process.env.PORT || 3000

//DB Setup
mongoose.connect('mongodb://heroku_25vmq1ql:nl3nl60mpepl6feaep1ee8kngj@ds023213.mlab.com:23213/heroku_25vmq1ql');

//App setup
app.use(compression());
app.use(bodyParser.json({type: '*/*'}));

if(TARGET !== 'start'){
  // serve our static stuff like index.css
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', function (req, res) {
    // and drop 'public' in the middle of here
    res.sendFile('index.html', { root: path.join(__dirname, './public') });
  })
  var PORT = process.env.PORT || 5000
}

router(app);

var server = app.listen(PORT, function() {
  if(PORT === 5000){
    console.log('Production Express server running at localhost:' + PORT)
  }else{
    console.log('Development Express server running at localhost:' + PORT)
  }

});

var io = require('socket.io').listen(server);
var messages = [];
var messageIndex = 0;
var users = [];

io.on('connection', function(socket){

  socket.emit('news', {msg: `'Hello World!' from server`});

  socket.on('newUser', function(data){
    var inUsers = false;
    if(users.length === 0){
      var new_user = {
        name: data,
        id: socket.id
      }
      users.push(new_user);
      io.emit('allUsers', users)
    }else{
      for(var x in users){
        if(users[x].name === data){
          var inUsers = true;
        }
      }
      if(inUsers === true){
        io.emit('allUsers', users)
      }else{
        var new_user = {
          name: data,
          id: socket.id
        }
        users.push(new_user);
        io.emit('allUsers', users)
      }
    }
  })

  socket.on('msg', function(data){
    data.id = data.text + messageIndex;
    messages[messageIndex] = data;
    messageIndex++;
    io.emit('msg', data);
  });

  socket.on('loggedOut', function(){
    for(var x in users){
      if(users[x].id === socket.id){
        var index = users.indexOf(users[x].id)
        users.splice(index, 1);
      }
    }
    io.emit('allUsers', users)
  })

  socket.on('disconnect', function(){
    for(var x in users){
      if(users[x].id === socket.id){
        var index = users.indexOf(users[x].id)
        users.splice(index, 1);
      }
    }
    io.emit('allUsers', users)
  })

  // A User starts a path
  socket.on( 'startPath', function( data, sessionId ) {

    socket.broadcast.emit( 'startPath', data, sessionId );

  });

  // A User continues a path
  socket.on( 'continuePath', function( data, sessionId ) {

    socket.broadcast.emit( 'continuePath', data, sessionId );

  });

  // Clear canvas
  socket.on( 'clearBoard', function() {

    io.sockets.emit( 'clearMe');

  });
});


/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , ambience = require('./routes/ambience')
  , http = require('http')
  , path = require('path')
  , light = require('./lib/light')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get(/ambience\/cinema\/?(.*)/, ambience.cinema);
app.get('/ambience/color', ambience.color);
app.get('/ambience/color/*', ambience.color);
//app.get('/audio/*', audio.play);
app.get('/', routes.index);

var server = http.createServer(app);
var io = require('socket.io');
var socket = io.listen(server);

console.log("foo")
light.init(socket.of('/ambience'));

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});


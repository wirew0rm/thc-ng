
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
app.get('/', ambience.color);

var PadKontrol = require('./lib/padkontrol')
var padkontrol = new PadKontrol(2, 2)
//padkontrol.open(2, 2);
padkontrol.on('pad_timer', function(pad, pressedTime, vel) {
  if (pad < 8) {
    var color = light.getMainColor();
    var speed = vel / 255 * pressedTime;

    if (pad == 0) color = color.darken(speed);
    if (pad == 4) color = color.lighten(speed);
    if (pad == 1) color = color.red(-speed, true);
    if (pad == 5) color = color.red(speed, true);
    if (pad == 2) color = color.green(-speed, true);
    if (pad == 6) color = color.green(speed, true);
    if (pad == 3) color = color.blue(-speed, true);
    if (pad == 7) color = color.blue(speed, true);
    
    light.setMainColor(color);
  }
})

padkontrol.on('pad', function(pad, pressed, vel) {
  if (pressed && pad == 8) audiosample.play('miau/miau.wav', vel / 127.0);
})

var server = http.createServer(app);
var io = require('socket.io');
var socket = io.listen(server);

light.init(socket.of('/ambience'));

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});


/*
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , ambience = require('./routes/ambience')
  , hexaswitch = require('./routes/hexaswitch')
  , http = require('http')
  , path = require('path')
  , light = require('./lib/light')
  , audio = require('./routes/audio')
  , audiosample = require('./lib/audiosample')
  , MPD = require('./lib/node-mpd/lib/')

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8001);
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
app.get('/ambience/color/*', ambience.color);
app.get('/ambience/color', ambience.color);
app.get('/ambience/script', ambience.showScripts);
app.get('/ambience/script/*', ambience.setScript);
app.get('/play*', audio.play);
app.get('/ring', audio.ring);
app.get('/', ambience.color);

try {
	var PadKontrol = require('./lib/padkontrol')
	var padkontrol = new PadKontrol(2, 2)

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
	if (pressed && pad == 9) audiosample.play('miau/mooh.wav', vel / 127.0);
	if (pressed && pad == 12) audiosample.play('miau/poettering.wav', vel   / 127.0);

	if (pad == 13) hexaswitch.switch("aaaa::50:c4ff:fe04:828e", pressed);
	})

	padkontrol.on('button', function(button, pressed) {
	if (pressed && button == 11) mpd.send('previous');
	if (pressed && button == 12) mpd.send('next');

	if (pressed && button == 15) {
		if (mpd.status.state == 'stop') {
			mpd.send('play');
		} else {
			mpd.send('pause');
		}
	}
	})

	var mpd = new MPD();

	mpd.on('connect', function() {
	mpd.volumeDiff = 0; // See rotary_encoder callback
	mpd.on('volume', function(volume) {
		padkontrol.setLEDSegments(volume);

		if (mpd.volumeDiff != 0) {
			// Hack: Implement sending of local volume changes here, because node-mpd is buggy and mixes up status requests
			var newVolume = parseInt(volume) + mpd.volumeDiff;
			newVolume = Math.max(0, Math.min(100, newVolume)); // Clamp to 0-100
			mpd.send('setvol ' + newVolume, function() {});
			mpd.volumeDiff = 0;
		}
	});
	});


	padkontrol.on('rotary_encoder', function(direction) {
	// Algorithm to avoid race condition / volume step skips:
	// 1) Send a status request if there is none pending
	// 2) Accumulate the volume changes
	// 3) Status callback: Compute and send the absolute volume, and reset local change counter

	mpd.volumeDiff += direction;

	// for 3) see mpd.on('volume')()
	})
} catch (err) {
	// handle the error safely
	console.log(err);
}

var server = http.createServer(app);
var io = require('socket.io');
var socket = io.listen(server);

light.init(socket.of('/ambience'));

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

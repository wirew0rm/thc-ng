var artnet = require('./artnet');
var onecolor = require('onecolor');

var sockets;

var client = artnet.createClient("2.0.0.2", 6454);

var barcolor = [onecolor('lime'), onecolor('tomato'), onecolor('plum'), onecolor('olive'), onecolor('navy')]
var cinemaMode = false;

function setBarColor(bar, color) {
	barcolor[bar] = color;
        update();
}

function setMainColor(color) {
	for (var i = 0; i < 5; i++) {
		barcolor[i] = color;
	}
	update();
}

function getMainColor() {
	return barcolor[0];
}

function setCinemaMode(on) {
	cinemaMode = on;
	update();
}

exports.init = function(socket) {
  sockets = socket;
  socket.on('connection', function(client) {
    client.on('color', function(data) {
      exports.setMainColor(onecolor(data));
    });
  });
}

function update() { 
	if (sockets) sockets.emit('color', barcolor[0].hex());

	dmx = new Array(128);

	for (var bar = 0; bar < 5; bar++) {
		// Interchange bars to accomodate real arrangement in room
		var bar_mapping = [2, 3, 4, 0, 1]
		var color = barcolor[bar_mapping[bar]];

		var r = color.r() * 255;
		var g = color.g() * 235;
		var b = color.b() * 245;


		for (var light = 0; light < 5; light++) {
			var light_offset = bar * 16 + light * 3;
			dmx[light_offset + 1] = r;
			dmx[light_offset + 2] = g; 
			dmx[light_offset + 3] = b; 
		}
	}

	if (cinemaMode) {
		var deactivated_bar = 3;
		for (var i = 0; i < 16; i++) {
			dmx[i + deactivated_bar * 16] = 0;
		}
	}

	client.send(dmx);
}


var timers = require('timers')

var hue = 0;

timers.setInterval(function () {
  hue = (hue + 1.5) % 360;

  for (var i = 0; i < 5; i++) {
    var offset_hue = (hue + 45 * i) % 360;
    var color = onecolor('hsv(' + offset_hue + ',255,255)');
//    barcolor[i] = color;
  }

//  update();

}, 50);


exports.setMainColor = setMainColor;
exports.getMainColor = getMainColor;
exports.setBarColor = setBarColor;
exports.setCinemaMode = setCinemaMode;

update();

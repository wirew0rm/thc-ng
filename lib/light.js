var artnet = require('./artnet');
var onecolor = require('onecolor');
var timers = require('timers');

var simple_script = require('./lightscripts/simple.js')

var sockets;

var client = artnet.createClient("2.0.0.2", 6454);

var barcolor = [onecolor('lime'), onecolor('tomato'), onecolor('plum'), onecolor('olive'), onecolor('navy')]

var manualScript = {
	getColor: function(bar, led) { return barcolor[led]; }
};

var currentScript = manualScript;

var cinemaMode = false;

function setBarColor(bar, color) {
	barcolor[bar] = color;
        update();
}

function setMainColor(color) {
	for (var i = 0; i < 5; i++) {
		barcolor[i] = color;
	}

	setLightScript();
	update();
}

function getMainColor() {
	return barcolor[0];
}

function setCinemaMode(on) {
	cinemaMode = on;
	update();
}

function setLightScript(path) {
	if (currentScript && currentScript.timer_id) {
		timers.clearInterval(currentScript.timer_id)
	}

	if (!path || path == "manual") {
		currentScript = manualScript;
		return;
	}

	currentScript = require('./lightscripts/' + path);
	currentScript.timer_id = timers.setInterval(function() {
		currentScript.update();
		update();
	}, currentScript.callbackTime);
}

exports.init = function(socket) {
  sockets = socket;
  socket.on('connection', function(client) {
    client.on('color', function(data) {
      exports.setMainColor(onecolor(data));
    });
  });
  
  
//  setLightScript("simple.js");
}



function update() { 
	if (sockets) sockets.emit('color', barcolor[0].hex());

	dmx = new Array(128);

	for (var bar = 0; bar < 5; bar++) {
		for (var light = 0; light < 5; light++) {
			// Interchange bars to accomodate real arrangement in room

			var bar_mapping = [2, 3, 4, 0, 1]
			var color = currentScript.getColor(bar_mapping[bar], light);
			var r = color.r() * 255;
			var g = color.g() * 235;
			var b = color.b() * 245;
			
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

        // garden gnome brightness
        dmx[64] = 0;
	client.send(dmx);
}


exports.setMainColor = setMainColor;
exports.getMainColor = getMainColor;
exports.setBarColor = setBarColor;
exports.setCinemaMode = setCinemaMode;
exports.setLightScript = setLightScript;

update();

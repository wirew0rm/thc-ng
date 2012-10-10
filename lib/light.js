var artnet = require('./artnet');
var onecolor = require('onecolor');

var client = artnet.createClient("2.0.0.2", 6454);

var light_map =  [3, 6, 9, 12, 15,
	       19, 22, 25, 28, 31, 
	       35, 38, 41, 44, 47, 
	       51, 54, 57, 60, 64, 
	       67, 70, 73, 76, 79];

var maincolor = onecolor("yellow");

exports.setMainColor = function(color) {
console.log(color);
console.log(onecolor(color));
	maincolor = onecolor(color);
	update();
}

exports.getMainColor = function() {
	return maincolor;
}

exports.init = function(socket) {
  socket.on('connection', function(client) {
    socket.on('color', function(data) {
      setMainColor(data);
    });
  });
}

function update() { 

	dmx = new Array(128);

	var r = maincolor.r() * 255;
	var g = maincolor.g() * 255;
	var b = maincolor.b() * 255;

	for (var bar = 0; bar < 5; bar++) {
		var offset = bar * 16;
		for (var light = 0; light < 5; light++) {
			var light_off = offset + light * 3;
			dmx[light_off + 1] = r;
			dmx[light_off + 2] = g; 
			dmx[light_off + 3] = b; 
		}
	}


	client.send(dmx);
}


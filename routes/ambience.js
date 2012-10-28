var light = require('../lib/light');
var onecolor = require('onecolor')

exports.color = function(req, res) {
  if (req.params != false && onecolor(req.params[0])) {
    console.log(req.params[0], onecolor(req.params[0]))
    light.setMainColor(onecolor(req.params[0]));
  }

  if (req.method == 'GET') {
    res.render('color', {color: light.getMainColor().hex()});
  }
}

exports.cinema = function(req, res) {
  if (req.params[0] == 'on') {
    light.setCinemaMode(true);
  } else if (req.params[0] == 'off') {
     light.setCinemaMode(false);
  } else {
    res.end("Usage: /ambience/cinema/[on|off]");
    return;
  }

  res.end()
}

var io = require('socket.io')

//io.sockets.on('connection', function(socket) {
//  console.log(socket);
//});

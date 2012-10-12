var light = require('../lib/light');

exports.color = function(req, res) {
  if (req.params) {
    light.setMainColor(req.params[0]);
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

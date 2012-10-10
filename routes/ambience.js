var light = require('../lib/light');

exports.color = function(req, res) {
  if (req.params) {
    light.setMainColor(req.params[0]);
  }

  if (req.method == 'GET') {
    res.render('color', {color: light.getMainColor().hex()});
  }
}

exports.setColor = function(req, res) {
  light.setMainColor(255, 255, 255);
  console.log(req);
}

var io = require('socket.io')

//io.sockets.on('connection', function(socket) {
//  console.log(socket);
//});

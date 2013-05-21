var light = require('../lib/light');
var onecolor = require('onecolor')
var fs = require('fs');

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

exports.showScripts = function(req, res) {
  var filelist = fs.readdirSync('./lib/lightscripts/').map(function(file) {
     return '<a href="' + file + '">' + file + '</a><br>';
  });
  filelist.unshift("<html><p>Usage: /ambience/script/$filename<br>$filename is one of the following:</p>\n");
  res.send(filelist.join("\n"));
  res.end();
}

exports.setScript = function(req, res) {
  var script = req.params[0];

  light.setLightScript(script);
  res.end();
}

var io = require('socket.io')

//io.sockets.on('connection', function(socket) {
//  console.log(socket);
//});

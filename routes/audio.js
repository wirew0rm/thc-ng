var audiosample = require('../lib/audiosample');
var fs = require('fs')
var timers = require('timers')

exports.ring = function(req, res) {
  var sounds = fs.readdirSync('./audio/ring/');
  var selected = 'ring/' + sounds[Math.floor(Math.random() * sounds.length)];

  timers.setTimeout(function() {
    audiosample.play(selected, 0.5);
  }, 1500);

  audiosample.play('horn1.wav', 0.5)
  res.end(selected);
}

exports.play = function(req, res) {
  if (req.params != false) {
    var path = 'miau' + req.params[0] + '.wav';
    console.log(path);
    audiosample.play(path, 0.8);
  }
  var filelist = fs.readdirSync('./audio/miau/').map(function(file) {
     var plainfile = file.replace(".wav", "");
     return '<a href="' + plainfile + '">' + plainfile + '</a><br>';
  });
  filelist.unshift("<html><p>Usage: /play/$filename<br>$filename is one of the following:</p>\n");
  res.send(filelist.join("\n"));
  res.end();
}


var child_process = require('child_process')

exports.play = function(filename, volume) {
  var prefix = './audio/';
  child_process.spawn('paplay', ['--property=media.role=phone', '--volume', volume * 60000, prefix + filename]);
}



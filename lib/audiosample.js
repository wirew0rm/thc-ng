var child_process = require('child_process')

exports.play = function(filename, volume) {
  var prefix = './audio/';
  var paplay = child_process.spawn('paplay', ['--property=media.role=phone', '--volume', volume * 60000, prefix + filename]);
  
  paplay.stdout.on('data', function (data) {
    console.log('paplay stdout: ' + data);
  });

  paplay.stderr.on('data', function (data) {
    console.log('paplay stderr: ' + data);
  });
}



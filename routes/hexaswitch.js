var child_process = require('child_process')

exports.switch = function(host, on) {
  var cmd = "/usr/local/bin/hexaswitch";
  var action = on ? "on" : "off";

  var hexaswitch = child_process.spawn(cmd, [action, host])
  
  hexaswitch.stdout.on('data', function (data) {
    console.log('hexaswitch stdout: ' + data);
  });
  hexaswitch.stderr.on('data', function (data) {
    console.log('hexaswitch stderr: ' + data);
  });
}



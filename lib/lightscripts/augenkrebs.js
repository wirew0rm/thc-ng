var onecolor = require('onecolor');

var hue = 0
var light = 100

// Interval time for update(). Beware, low values may cause serious CPU usage!
exports.callbackTime = 60; // 10 milliseconds

// Is called for each RGB led after update()
//   bar: Index of LED bar, in range 0 to 4
//   led: Index of a single RGB LED in a bar
exports.getColor = function(bar, led) {
  var color = onecolor('hsv(' + hue + ',100,' + light + ')');
//  console.log(color)
  return color;
}


// Callback to update the internal model of the light script
exports.update = function() {
  hue = Math.random() * 360
  console.log(hue)
};


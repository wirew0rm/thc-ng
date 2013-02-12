var onecolor = require('onecolor');

// Script local model values
var time = 0;
var hue = 0;
var light = 100;

// Interval time for update(). Beware, low values may cause serious CPU usage!
exports.callbackTime = 10; // 10 milliseconds

// Is called for each RGB led after update()
//   bar: Index of LED bar, in range 0 to 4
//   led: Index of a single RGB LED in a bar
exports.getColor = function(bar, led) {
  var color = onecolor('hsv(' + hue + ',255,' + light + ')');
  console.log(color)
  return color;
}

// Callback to update the internal model of the light script
exports.update = function() {
  time = Date.now() / 1000;
//  light = (Math.sin(time * 20) + 1 + Math.sin(time * 25)) * 100
//  light = Math.sin((time * 7 % 2 * 3.141) - 3.141) * 120 + 127
//  light = Math.sin(time * 4)  * 60 + 120

  bpm = 127.5
  
  var timebase = time * bpm / 60 * (2* 3.141)

  var pulse14 = Math.sin(timebase / 8)
  var pulse24 = Math.sin(timebase / 7)
  var pulse44 = Math.sin(time * bpm / 60 * (2* 3.141))
//  pulse44 = Math.sin(time * 10)

  light = pulse24  * 80 + 100
  hue = ((pulse24 ) * pulse24 *  Math.sin(timebase / 16) + 1.0) * 50 % 255
};


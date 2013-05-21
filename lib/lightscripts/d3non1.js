var onecolor = require('onecolor');

// Script local model values
var time = 0;
var hue = 240;
var light = 100;
var target = 240;

// Interval time for update(). Beware, low values may cause serious CPU usage!
exports.callbackTime = 75; // 10 milliseconds

// Is called for each RGB led after update()
//   bar: Index of LED bar, in range 0 to 4
//   led: Index of a single RGB LED in a bar
exports.getColor = function(bar, led) {
  var color = onecolor('hsv(' + hue + ',100,' + light + ')');
//  console.log(color)
  return color;
}

function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }

function huedist(b,a) {
  ab = a - b
  ba = b - a
  return (Math.abs(ab) > Math.abs(ba) ? ba : ab)
}

// Callback to update the internal model of the light script
exports.update = function() {
  
  
  dist = huedist(hue,target)
  if(Math.abs(dist) < 5) {
    do {
      target = Math.random() * 360
    }while( Math.abs(huedist(hue,target)) < 90)
  }
//  step = Math.ceil(0.01 * dist)
//  if(step == 0)
    step = 0.12 * sign(dist)
//  console.log("[d3nonlog] hue: "+hue+"target: "+target+"dist: "+dist+"step:"+step)
  hue += step
};


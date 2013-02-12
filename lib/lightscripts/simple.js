var onecolor = require('onecolor');

exports.callbackTime = 1000;

exports.getColor = function(bar, led) {
  var barcolor = [onecolor('lime'), onecolor('tomato'), onecolor('plum'), onecolor('olive'), onecolor('navy')];
  return barcolor[bar];
}

exports.update = function() {
};


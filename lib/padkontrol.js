var midi = require("midi");
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var timers = require('timers');
var microtime = require('microtime');

var pkmidi_header = new Buffer('F042406E08', 'hex');
var pkmidi_footer = new Buffer('F7', 'hex');

Buffer.prototype.toByteArray = function () {
  return Array.prototype.slice.call(this, 0);
}

var PadKontrol = function(inport, outport) {
  this.open(inport, outport);
}

PadKontrol.prototype = Object.create(EventEmitter.prototype);

PadKontrol.prototype.open = function (inport, outport) {
  // Use lsmidi (installable from npm) to find out correct port numbers
  this.output = new midi.output();
  this.input = new midi.input();
  this.output.openPort(outport);
  this.input.openPort(inport);
  this.input.ignoreTypes(false, false, false);
  
  this.__pad_intervals = new Array(16);
  
  this.input.on('message', this.__recvPKMessage.bind(this));
  this.__sendPKMessage(new Buffer("000001", 'hex'));
  this.__sendPKMessage(new Buffer("3F0A017F7F7F7F7F00383838", 'hex'));
  this.__sendPKMessage(new Buffer("3F2A00000505057F7E7F7F030A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0102030405060708090A0B0C0D0E0F10", 'hex' ));
//  setInterval
}

PadKontrol.prototype.__recvPKMessage = function(deltaTime, message) {
  // Check and strip MIDI header and footer
  for (var i = 0; i < pkmidi_header.length; i++) {
    if (pkmidi_header[i] != message.shift()) {
      console.log('pkmidi warning: invalid message received');
      return;
    }
  }
  
  for (var i = 0; i < pkmidi_footer.length; i++) {
    if (pkmidi_footer[i] != message.pop()) {
      console.log('pkmidi warning: invalid message received');
      return;
    }
  }
  
  if (message.length < 2) {
    console.log('pkmidi warning: invalid short message received');
  }

  // Message is now payload
  
  switch (message[0]) {
    case 0x45:
      var pad = message[1] & 0xf;
      var pressed = message[1] & 0x40;
      var vel = message[2];
      this.emit('pad', pad, pressed, vel);
      // Code for asynchronous state triggering
      if (pressed) {
          this.__pad_intervals[pad] = timers.setInterval(function(pad, vel, startTime) {
          this.emit('pad_timer', pad, microtime.nowDouble() - startTime, vel);
        }.bind(this), 25, pad, vel, microtime.nowDouble());
      } else {
        timers.clearInterval(this.__pad_intervals[pad]);
      }
      break;
    case 0x48:
      var button = message[1];
      var pressed = message[2];
      console.log('button %d %s (vel %d)', button, pressed ? 'pressed' : 'released');

    default:
      console.log("Unimplemented Command: ", Buffer(message).toString('hex'));
  }
}

PadKontrol.prototype.__sendPKMessage = function(data) {
  var buffer = Buffer.concat([pkmidi_header, data, pkmidi_footer]);
  this.output.sendMessage(buffer.toByteArray())
}

PadKontrol.prototype.close = function() {
  this.__sendPKMessage('000000');
  this.input.closePort();
  this.output.closePort();
}

PadKontrol.prototype.__update = function() {
  
}

module.exports = PadKontrol;


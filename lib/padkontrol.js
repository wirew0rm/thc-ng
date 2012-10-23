var midi = require("midi");
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var pkmidi_header = new Buffer('F042406E08', 'hex');
var pkmidi_footer = new Buffer('F7', 'hex');

Buffer.prototype.toByteArray = function () {
  return Array.prototype.slice.call(this, 0);
}

var PadKontrol = function (inport, outport) {
  this.open(inport, outport)
}

util.inherits(PadKontrol, EventEmitter);

PadKontrol.prototype.open = function (inport, outport) {
  // Use lsmidi (installable from npm) to find out correct port numbers
  this.output = new midi.output();
  this.input = new midi.input();
  this.output.openPort(outport);
  this.input.openPort(inport);
  this.input.ignoreTypes(false, false, false);
  
  this.input.on('message', this.__recvPKMessage);
  this.__sendPKMessage(new Buffer("000001", 'hex'));
  this.__sendPKMessage(new Buffer("3F0A017F7F7F7F7F00383838", 'hex'));
  this.__sendPKMessage(new Buffer("3F2A00000505057F7E7F7F030A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0102030405060708090A0B0C0D0E0F10", 'hex' ));
}

PadKontrol.prototype.__recvPKMessage = function(deltaTime, message) {
  console.log(pkmidi_header.length)
  console.log(new Buffer(message.slice(0, pkmidi_header.length)))
console.log(pkmidi_header)
  console.log('m:' + Buffer(message).toString('hex') + ' d:' + deltaTime);
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

module.exports = PadKontrol;

var pk = new PadKontrol(2, 2);
console.log(pk)
setTimeout(function() {
//  pk.close()
}, 2000);

var net = require('net'),
		sys = require('sys');
var swallowlines = {};
function Minecraft() {
	var self = this;
	process.EventEmitter.call(self);
	self.sock = net.createConnection('/tmp/minecraft');
	function ondata(data) {
		var lines = data.toString().split('\n');
		for (var i = 0, l = lines.length; i < l; ++i) {
			var line = lines[i];
			if (line.length) {
				online(line);
			}
		}
	}
	function online(line) {
		var o = line.match(/^20\d\d-..-.. ..:..:.. \[INFO\] (.*)/);
		if (!o) return;
		line = o[1];
		o = line.match(/^<([^>]*)> (.*)/);
		if (o) {
			// sender, message
			self.emit('message', o[1], o[2]);
			return;
		}
		o = line.match(/^\[CONSOLE\] (.*)/);
		if (o) {
			var msg = o[1];
			if (swallowlines[msg]) {
				var latency = new Date().getTime() - swallowlines[msg].getTime();
				self.emit("latency", latency);
				delete swallowlines[msg];
			} else {
				self.emit("consolemessage", msg);
			}
			return;
		}
		o = line.match(/^([a-zA-Z0-9]+) .* logged in with entity id/);
		if (o) {
			// username
			self.emit('login', o[1]);
			return;
		}
		o = line.match(/^([a-zA-Z0-9]+) lost connection: (.*)/);
		if (o) {
			// username, reason
			self.emit('logout', o[1], o[2]);
		}
	}
	setTimeout(function () {
		self.sock.on('data', ondata);
	}, 1000);
}
sys.inherits(Minecraft, process.EventEmitter);
Minecraft.prototype.command = function (cmd) {
	this.sock.write(cmd+'\n');
};
Minecraft.prototype.say = function (msg) {
	swallowlines[msg] = new Date;
	this.command('say '+msg);
};
exports.Minecraft = Minecraft;

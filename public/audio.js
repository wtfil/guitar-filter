var AudioContext = window.AudioContext || window.webkitAudioContext;
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

var context = new AudioContext();

var sourceNode = context.createBufferSource();

var analyser = context.createAnalyser();
analyser.smoothingTimeConstant = 0.3;
analyser.fftSize = 1024;

var processor = context.createScriptProcessor();

var hightFilter = context.createBiquadFilter();
var lowFilter = context.createBiquadFilter();
hightFilter.type = 'highpass';
lowFilter.type = 'lowpass';

sourceNode.connect(hightFilter);
/*analyser.connect(hightFilter);*/
hightFilter.connect(lowFilter);
lowFilter.connect(analyser);
analyser.connect(processor);
processor.connect(context.destination);
analyser.connect(context.destination);

function load(url, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function () {
		context.decodeAudioData(xhr.response, function (buffer) {
			cb(null, buffer);
		});
	};
	xhr.onerror = cb;
	xhr.send();
}

function play(buffer) {
	sourceNode.buffer = buffer;
	sourceNode.start(0);
	filter(0, 41200);
	processor.onaudioprocess = function () {
		var arr =  new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(arr);
		ee.emit('process', arr);
	};
}

function filter(from, to) {
	lowFilter.frequency.value = to;
	hightFilter.frequency.value = from;
}

module.exports = ee;
module.exports.load = load;
module.exports.play = play;
module.exports.filter = filter;

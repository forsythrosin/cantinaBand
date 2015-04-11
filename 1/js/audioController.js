navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
                          
var callbacks,
    audioContext,
    analyzer,
    analyzerInput,
    lowPass,
    highPass,
    freqData,
    mediaSource,
    state,
    amplitude,
    accAmp;

var states = {
  NONE: 0,
  UP: 1,
  DOWN: 2,
  SHOOT: 3
};
    
function initialize() {
  state = states.NONE;

  callbacks = {
    upStart: [],
    upEnd: [],
    downStart: [],
    downEnd: [],
    shoot: []
  };
  
  audioContext = getAudioContext();
  analyzer = audioContext.createAnalyser();
  analyzerInput = audioContext.createGain();
  
  lowPass = audioContext.createBiquadFilter();
  highPass = audioContext.createBiquadFilter();
  
  lowPass.type = lowPass.LOWPASS;
  highPass.type = highPass.HIGHPASS;
  
  lowPass.frequency.value = 2000;
  highPass.frequency.value = 100;
  
  lowPass.connect(highPass);
  highPass.connect(analyzer);
  analyzerInput.connect(lowPass);
  
  freqData = new Uint8Array(analyzer.frequencyBinCount);
}

function trig(callbacks) {
  for (var l = callbacks.length, i = 0; i < l; i++) {
    callbacks[i]();
  }
}

function getAudioContext() {
  return new AudioContext();
}

var accDiff = 0, numDiff = 0, maxDiff = 0;
function getCurrentFrequency(plotFrequencies) {
  analyzer.getByteFrequencyData(freqData);
  
  var n = freqData.length;
  var iterations = 5;
  var m = Math.floor(n/iterations);
  
  var plotData = new Array(n);
  
  var avg = 0, max = 0;
  for (var i = 0; i < n; i++) {
    plotData.push([i, freqData[i]]);
    if (freqData[i] >= freqData[max]) {
      max = i;
    }
    avg += freqData[i];
  }
  avg /= n;
  
  var prevAccAmplitude = accAmp;
  amplitude = freqData[max];
  
  accAmp = n * avg;
  var ampDiff = accAmp - prevAccAmplitude;
  
  if (prevAccAmplitude !== undefined && ampDiff > 2300) {
    state = states.SHOOT;
  } else if ((amplitude - avg) > 150) {
    if (max > 8) {
      state = states.UP;
    } else {
      state = states.DOWN;
    }
  } else {
    state = states.NONE;
  }
  
  var options = {
    yaxis: {
        max: 300
    },
    xaxis: {
        max: freqData.length/30
    }
  };
  if (plotFrequencies) $.plot($("#frequencySpectrum"), [plotData], options);
  
  return max;
}

function initializeMicrophone(stream) {
  console.log('Microphone initialized');
  mediaSource = audioContext.createMediaStreamSource(stream);
  mediaSource.connect(analyzerInput);
}

function mainLoop(plotFrequencies) {
  var prevState = state;
  var freq = getCurrentFrequency(plotFrequencies);
  if (state != prevState) {
    switch (state) {
      case states.NONE: {
        switch (prevState) {
          case states.UP:
            trig(callbacks.upEnd);
            break;
          case states.DOWN:
            trig(callbacks.downEnd);
            break;
        }
        break;
      }
      case states.UP: {
        trig(callbacks.upStart);
        if (prevState == states.DOWN) trig(callbacks.downEnd);
        break;
      }
      case states.DOWN: {
        trig(callbacks.downStart);
        if (prevState == states.UP) trig(callbacks.upEnd);
        break;
      }
      case states.SHOOT:
        trig(callbacks.shoot);
        if (prevState == states.DOWN) trig(callbacks.downEnd);
        if (prevState == states.UP) trig(callbacks.upEnd);
        break;
    }
  }
}

var plotFrequencies = false;
var audioController = {
  initialize: function(plot) {
    plotFrequencies = plot;
    initialize();
    setTimeout(function() {
      navigator.getUserMedia({audio: true}, initializeMicrophone, function (err) {console.log(err);});
    }, 100);
  },
  step: function() {
    mainLoop(plotFrequencies);
  },
  onUpStart: function(callback) {
    callbacks.upStart.push(callback);
    return audioController;
  },
  onUpEnd: function(callback) {
    callbacks.upEnd.push(callback);
    return audioController;
  },
  onDownStart: function(callback) {
    callbacks.downStart.push(callback);
    return audioController;
  },
  onDownEnd: function(callback) {
    callbacks.downEnd.push(callback);
    return audioController;
  },
  onShoot: function(callback) {
    callbacks.shoot.push(callback);
    return audioController;
  },
  printStats: function() {
    console.log(accDiff/numDiff, maxDiff, numDiff);
  }
};

module.exports = audioController;
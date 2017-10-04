/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var UncertaintyRelationsPackets = function(domLocationIn) {
  var urpThis = this
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var button3 = document.getElementById('play3packs');
  var button3Replay = document.getElementById('play3packsReplay');
  var button2 = document.getElementById('play2packs');
  var packs;
  var pack = [{}, {}, {}];
  var playing = false;

  // Mono
  var channels = 1;
  // Create a two second buffer at the
  // sample rate of the AudioContext
  var duration = 2;
  var improveTimeWhenCorrect = .7;
  var improveFrequencyWhenCorrect = .7;
  var worsenTimeWhenWrong = 1.15;
  var worsenFrequencyWhenWrong = 1.15;
  var frameCount = audioCtx.sampleRate * duration;
  var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

  var allBlocks = document.getElementsByClassName("allBlocks")[0];
//  allBlocks.style.display = "none";
  /* Graphics */
  var domLocation;
  if (domLocationIn instanceof HTMLElement){
    domLocation = domLocationIn;
  } else if (typeof myinput == 'string'){
    domLocation = document.getElementById(domLocationIn);
  } else {
    domLocation = document.body;
  }
  this.domLocation = domLocation;
  var pixDiv = document.createElement("div");
  var pixBtn = document.createElement("button");
  var pixHr = document.createElement("hr");
  let pixBtnText = document.createTextNode("Create graphical uncertainty test");
  pixBtn.appendChild(pixBtnText);
  domLocation.appendChild(pixHr);
  pixDiv.appendChild(pixBtn);
  pixDiv.style.justifyContent = "center";
  pixDiv.style.display = "flex";
  domLocation.appendChild(pixDiv);
  document.addEventListener('DOMContentLoaded',
    function() {
      console.log`DOM loaded`;
  });

  /* end Graphics */


  this.pack2 = {
    duration: 1,
    urTime: 2,
    urFrequency: 2,
    ur2pText: document.getElementById("ur2p")
  };
  this.pack3 = {
    duration: 2,
    urTime: 2,
    urFrequency: 2,
    packs: 3,
    ur3pText: document.getElementById("ur3p"),
    toneOneFrequency: 2 * Math.PI / audioCtx.sampleRate * (1200 + 5200 * Math.random()),
    toneOneSpan: 1/audioCtx.sampleRate * Math.random(),
  };
  var play3Packs = function(event) {
    if (playing) return;
    frameCount = audioCtx.sampleRate * urpThis.pack3.duration;
    playing = true;
    urpThis.pack3.urFrequency *= (event.target.parentNode.classList.contains(urpThis.pack3.yClass)) ? improveFrequencyWhenCorrect : worsenFrequencyWhenWrong;    
    urpThis.pack3.urTime *= (event.target.classList.contains(urpThis.pack3.xClass)) ? improveTimeWhenCorrect : worsenTimeWhenWrong;
    var txt = document.createTextNode(Math.sqrt(urpThis.pack3.urFrequency * urpThis.pack3.urTime).toFixed(5));
    urpThis.pack3.ur3pText.innerText = txt.textContent;
    // Fill the buffer with values between -1.0 and 1.0

    for (var channel = 0; channel < channels; channel++) {
      // This gives us the actual ArrayBuffer that contains the data
      var nowBuffering = myArrayBuffer.getChannelData(channel);
      pack[0].freq = urpThis.pack3.toneOneFrequency;
      pack[0].shift = audioCtx.sampleRate * .5;
      pack[0].span = urpThis.pack3.toneOneSpan;

      pack[1].freq = 2 * Math.PI / audioCtx.sampleRate * (200 + 15200 * Math.random());
      pack[1].shift = audioCtx.sampleRate * (1.2 + 0.6 * Math.random());
      pack[1].span = 1/audioCtx.sampleRate * Math.random();

      pack[2].freq = pack[0].freq;
      pack[2].shift = audioCtx.sampleRate * 1.5;
      pack[2].span = pack[0].span;

      for (var i = 0; i < frameCount; i++) {
        var sample = 0;
        for (var j = 0; j < pack.length; j++) {
          sample += Math.sin(pack[j].freq * i) * Math.exp(-pack[j].span * Math.pow(i - pack[j].shift, 2))/2;
        }
        nowBuffering[i] = sample * 0.75 + 0.25*(-1 + 2*Math.random());
      }
    }

    urpThis.pack3.xClass = (pack[2].shift < pack[1].shift ) ? "first" : "third";
    if (Math.abs(pack[2].shift - pack[1].shift) === 0 ) 
      urpThis.pack3.xClass = "second";

    urpThis.pack3.yClass = (pack[2].freq < pack[1].freq ) ? "containerTop" : "containerBottom";
    if (Math.abs(pack[2].freq - pack[1].freq) === 0 ) 
      urpThis.pack3.yClass = "containerMid";

    function playSound() {
      button3Replay.disabled = true;
      button3.disabled = true;
      var source = audioCtx.createBufferSource();
      source.buffer = myArrayBuffer;
      source.connect(audioCtx.destination);
      source.onended = function() {
        playing = false;
      };
      // workaround for onended not firing always
      setTimeout(function() {
          playing = false;
          button3Replay.disabled = false;
          button3.disabled = false;
        }, 1000 * urpThis.pack3.duration
      );
      source.start();
    }
    playSound();
    button3Replay.onclick = function() {
      if (playing) return;
      playSound();
    };
  };

  var play2Packs = function(event) {
    if (playing) return;
    frameCount = audioCtx.sampleRate * urpThis.pack2.duration;
    playing = true;
    urpThis.pack2.urFrequency *= (event.target.id.indexOf(urpThis.pack2.correctBtnIdFrequency) === -1 ? improveFrequencyWhenCorrect : worsenFrequencyWhenWrong);
    urpThis.pack2.urTime *= (event.target.id.indexOf(urpThis.pack2.correctBtnIdTime) === -1 ? improveTimeWhenCorrect : worsenTimeWhenWrong);
//    urpThis.pack2.urFrequency *= (event.target.parentNode.classList.contains(urpThis.pack3.yClass)) ? improveFreqWhenCorrect : worsenFreqWhenWrong;    
//    var ur = 1.23;
    var txt = document.createTextNode(Math.sqrt(urpThis.pack2.urFrequency * urpThis.pack2.urTime).toFixed(5));
    urpThis.pack2.ur2pText.innerText = txt.textContent;

    // Fill the buffer with values between -1.0 and 1.0
    for (var channel = 0; channel < channels; channel++) {
      // This gives us the actual ArrayBuffer that contains the data
      var nowBuffering = myArrayBuffer.getChannelData(channel);
      pack[0].freq = 2 * Math.PI / audioCtx.sampleRate * (1200 + 5200 * Math.random());
      pack[0].shift = audioCtx.sampleRate * .5;
      pack[0].span = 1/audioCtx.sampleRate * Math.random();

      pack[1].freq = 2 * Math.PI / audioCtx.sampleRate * (200 + 15200 * Math.random());
      pack[1].shift = audioCtx.sampleRate * (0.2 + 0.6 * Math.random());
      pack[1].span = 1/audioCtx.sampleRate * Math.random();

      for (var i = 0; i < frameCount; i++) {
        var sample = 0;
        for (var j = 0; j < pack.length; j++) {
          sample += Math.sin(pack[j].freq * i) * Math.exp(-pack[j].span * Math.pow(i - pack[j].shift, 2))/2
        }
        nowBuffering[i] = sample;
      }
    }

    urpThis.pack2.correctBtnIdFrequency = "Frequency" + (pack[0].freq == pack[1].freq ) ? "Same" : "Different";
    urpThis.pack2.correctBtnIdTime = "Time" + (pack[0].shift == pack[1].shift ) ? "Same" : "Different";

    if (Math.abs(pack[2].shift - pack[1].shift) === 0 ) 
      urpThis.pack3.xClass = "second";


    var source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.onended = function() {
      playing = false;
    }
    // workaround for onended not firing always
    setTimeout(function() {playing = false;}, 1000 * urpThis.pack2.duration)
    source.start(0, 0, 1);
  }

  this.pack2stereo = {
    duration: 1,
    urTime: 2,
    urFrequency: 2,
    channels: 2,
    ur2pText: document.getElementById("beepBirdTimeDiff")
  };

  var play2PacksStereo = function(event) {
    if (playing) return;
    frameCount = audioCtx.sampleRate * urpThis.pack2stereo.duration;
    playing = true;
    urpThis.pack2stereo.urFrequency *= (event.target.id.indexOf(urpThis.pack2stereo.correctBtnIdFrequency) === -1 ? improveFrequencyWhenCorrect : worsenFrequencyWhenWrong);
    urpThis.pack2stereo.urTime *= (event.target.id.indexOf(urpThis.pack2stereo.correctBtnIdTime) === -1 ? improveTimeWhenCorrect : worsenTimeWhenWrong);
//    urpThis.pack2.urFrequency *= (event.target.parentNode.classList.contains(urpThis.pack3.yClass)) ? improveFreqWhenCorrect : worsenFreqWhenWrong;    
//    var ur = 1.23;
    var txt = document.createTextNode(Math.sqrt(urpThis.pack2stereo.urFrequency * urpThis.pack2stereo.urTime).toFixed(5));
    urpThis.pack2stereo.ur2pText.innerText = txt.textContent;

    // Fill the buffer with values between -1.0 and 1.0
    for (var channel = 0; channel < urpThis.pack2stereo.channels; channel++) {
      // This gives us the actual ArrayBuffer that contains the data
      var nowBuffering = myArrayBuffer.getChannelData(channel);
      pack[0].freq = 2 * Math.PI / audioCtx.sampleRate * (1200 + 5200 * Math.random());
      pack[0].shift = audioCtx.sampleRate * .5;
      pack[0].span = 1/audioCtx.sampleRate * Math.random();

      pack[1].freq = 2 * Math.PI / audioCtx.sampleRate * (200 + 15200 * Math.random());
      pack[1].shift = audioCtx.sampleRate * (0.2 + 0.6 * Math.random());
      pack[1].span = 1/audioCtx.sampleRate * Math.random();

      for (var i = 0; i < frameCount; i++) {
        var sample = 0;
        for (var j = 0; j < pack.length; j++) {
          sample += Math.sin(pack[j].freq * i) * Math.exp(-pack[j].span * Math.pow(i - pack[j].shift, 2))/2
        }
        nowBuffering[i] = sample;
      }
    }

    urpThis.pack2stereo.correctBtnIdFrequency = "Frequency" + (pack[0].freq == pack[1].freq ) ? "Same" : "Different";
    urpThis.pack2stereo.correctBtnIdTime = "Time" + (pack[0].shift == pack[1].shift ) ? "Same" : "Different";

    if (Math.abs(pack[2].shift - pack[1].shift) === 0 ) 
      urpThis.pack3.xClass = "second";


    var source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.onended = function() {
      playing = false;
    }
    // workaround for onended not firing always
    setTimeout(function() {playing = false;}, 1000 * urpThis.pack2stereo.duration)
    source.start(0, 0, 1);
  }

  button2.onclick = play2Packs;
  var buttons2 = document.getElementsByClassName("packs2");
  for (var i = 0; i < buttons2.length; i++) {
      buttons2[i].addEventListener('click', play2Packs, false);
  }  
  button3.onclick = play3Packs;
  allBlocks.addEventListener('click', play3Packs, false);

  /* Graphics uncertainty */
  let scaling = 1;
  var addUCgraphics = function(canvas) {
    let xr, yr, color = 0, rndBW, gaussian, gaussian_1, gaussian1, gaussK, gaussKexp;
//    canvas.width = 0.8 * scaling * document.body.offsetWidth;
//    canvas.height = 0.5 * scaling * document.body.offsetHeight;
    let uncertain2d = canvas.getContext("2d");
    uncertain2d.scale(1 / scaling, 1 / scaling);
//    let image = uncertain2d.getImageData(0, 0, canvas.width, canvas.height);
    let image = uncertain2d.createImageData(canvas.width, canvas.height);

    let pixels = canvas.width * canvas.height;
    let x = scaling * canvas.width;
    let y = scaling * canvas.height;
    let imageData = new Uint8ClampedArray(4 * pixels);

    gaussKexp = -46;
    gaussK = 16;
    for(let yd = 0; yd < 4 * y; yd++){
      for(let xd = 0; xd < x; xd++){
        xr = 2 * xd / x - 1;
        yr = 2 * yd / y - 1;
        gaussian = Math.exp(gaussKexp * (xr * xr + yr * yr));
        gaussian_1x = Math.exp(gaussKexp * (Math.pow(xr - .5, 2) + Math.pow(yr, 2)));
        gaussian1x = Math.exp(gaussKexp * (Math.pow(xr + .5, 2) + Math.pow(yr, 2)));
        rndBW = gaussian * gaussK * (0.5 * Math.sin(xr * 130) + .5) + (256 - gaussK) * Math.random() +
         + gaussian_1x * gaussK * (0.5 * Math.sin(xr * 100) + .5) +
         + gaussian1x * gaussK * (0.5 * Math.sin(xr * 160) + .5);
        imageData[color++] = rndBW; //(xr+yr < .5) ? 255 * Math.random() : 63; // Red value
        imageData[color++] = rndBW; // Green value
        imageData[color++] = rndBW; //* Math.random(); // Blue value
        imageData[color++] = 255; // Alpha value
      }
    }

    image.data.set(imageData);
    uncertain2d.putImageData(image, 0, 0);
    return canvas;
  }
  urpThis.addUCgraphics = addUCgraphics;
  let ucCanvas = document.createElement('canvas');
  ucCanvas.width = Math.floor(0.9 * scaling * window.innerWidth);
  ucCanvas.height = Math.floor(0.85 * scaling * window.innerHeight);
  pixDiv.appendChild(ucCanvas);
  pixBtn.addEventListener("click", () => {addUCgraphics(ucCanvas)}, false);
}
 
this.drawPacket = function drawPacket() {
  //Writes a wave packet

  //if (typeof(WavePacket) == 'undefined') window.WavePacket = {};
  if (typeof(WavePacket) == 'undefined') WavePacket = {};
  WavePacket.Trig = {};
  WavePacket.Trig.init = init;

  var unit = 100,
      canvas, context, canvas2, context2,
      height, width, xAxis, yAxis,
      draw;

  /**
   * Init function.
   * 
   * Initialize variables and begin the animation.
   */
  function init() {

      canvas = document.getElementById("sineCanvas");

      canvas.width = 800;
      canvas.height = 300;

      context = canvas.getContext("2d");
      context.font = '18px sans-serif';
      context.strokeStyle = '#00f';
      context.lineJoin = 'round';

      height = canvas.height;
      width = canvas.width;

      xAxis = Math.floor(height/2);
      yAxis = Math.floor(width/4);

      context.save();
      draw();
  }

  /**
   * Draw animation function.
   * 
   * This function draws one frame of the animation, waits 20ms, and then calls
   * itself again.
   */
  draw = function () {

      // Clear the canvas
      context.clearRect(0, 0, width, height);

      context.beginPath();
      context.stroke();

      // Set styles for animated graphics
      context.save();
      context.strokeStyle = '#fff';
      context.fillStyle = '#fff';
      context.lineWidth = 2;

      // Draw the sine curve at time draw.t, as well as the circle.
      context.beginPath();
      drawSine(draw.t);
      context.stroke();

      // Restore original styles
      context.restore();

  };
  draw.t = 0;


  /**
   * Function to draw sine
   * 
   * The sine curve is drawn in 10px segments starting at the origin. 
   */
  function drawSine(t) {

      // Set the initial x and y, starting at 0,0 and translating to the origin on
      // the canvas.
      var x = t;
      var y = Math.sin(x);
      context.moveTo(yAxis, unit*y+xAxis);

      // Loop to draw segments
      for (i = yAxis; i <= width; i += 1) {
          x = t+(-yAxis+i)/unit;
          y = Math.sin(15*x)*Math.exp(-Math.pow(x-Math.PI,2));
          context.lineTo(i, unit*y+xAxis);
      }
  }
  WavePacket.Trig.init()
};


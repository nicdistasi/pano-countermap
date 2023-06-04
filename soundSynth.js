const altitudeSlider = document.getElementById("altitude-slider");
const altitudeSliderHandle = document.getElementById("altitude-slider-handle");
const altitudeValElem = document.getElementById("altitude-val");
const difficultyValElem = document.getElementById("difficulty-val");

var sounds = {};
var difficulty = 1;
var graphDiffs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var prevPoint = 0;

//preload sound elements
function preload() {
  sounds.birdAmbience = loadSound('sound-elements/birds-ambience.mp3');
  sounds.calmPad = loadSound('sound-elements/calm-pad.mp3');
  sounds.mellowPad = loadSound('sound-elements/mellow-pad.mp3');
  sounds.tensePad = loadSound('sound-elements/tense-pad.mp3');
  sounds.droneBass = loadSound('sound-elements/drone-bass.mp3');
  sounds.droneHat = loadSound('sound-elements/drone-hat.mp3');
  sounds.heartbeat = loadSound('sound-elements/heart-beat.mp3');
}

function setup() {
  let canvas = createCanvas(300, 200);
  canvas.parent("#difficulty-info");
  frameRate(10);

  sounds.birdAmbience.loop();
  sounds.birdAmbience.setVolume(0);
  sounds.calmPad.loop();
  sounds.calmPad.setVolume(0);
  sounds.mellowPad.loop();
  sounds.mellowPad.setVolume(0);
  sounds.tensePad.loop();
  sounds.tensePad.setVolume(0);
  sounds.droneBass.loop();
  sounds.droneBass.setVolume(0);
  sounds.droneHat.loop();
  sounds.droneHat.setVolume(0);
  sounds.heartbeat.loop();
  sounds.heartbeat.setVolume(0);
}

//update variables on altitude change
function updateAltitude() {
  if (!sounds.birdAmbience.isPlaying()) {
    getAudioContext().resume();
  };
  var altitudeVal = altitudeSlider.value;

  //move slider handle
  var sliderPercent = ((altitudeVal-500)/4)/100;
  var sliderHeight = (window.innerHeight / 2)-15;
  var sliderPixOffset = sliderHeight * sliderPercent;
  altitudeSliderHandle.style.transform = `translateX(-25px) translateY(-${sliderPixOffset}px)`;

  altitudeValElem.innerHTML = altitudeVal;
}

function draw() {
  //initialize graph
  background(0, 0, 0);
  stroke(255);
  strokeWeight(2);
  line(0, 180, 280, 180);
  line(280, 180, 280, 20);

  //move graph values
  for (let p = graphDiffs.length; p > 0; p--) {
    var diffPoint = graphDiffs[p];
    prevPoint = diffPoint;
    graphDiffs[p] = graphDiffs[p-1];
  }

  var altitudeVal = altitudeValElem.innerHTML;

  //determine difficulty level for new altitude
  if (altitudeVal <= 575) { difficulty = 2; }
  else if (altitudeVal > 575 && altitudeVal <= 625) { difficulty = 3; }
  else if (altitudeVal > 625 && altitudeVal <= 700) { difficulty = 5; }
  else if (altitudeVal > 700 && altitudeVal <= 750) { difficulty = 3; }
  else if (altitudeVal > 750 && altitudeVal <= 825) { difficulty = 4; }
  else if (altitudeVal > 825 && altitudeVal < 900) { difficulty = 5; }
  else if (altitudeVal == 900) { difficulty = 1; }

  var diffRandomization = parseInt(random(8, 0));
  if (difficulty != 1) { difficulty = difficulty - (diffRandomization/10); }
  
  difficultyValElem.innerHTML = difficulty.toFixed(1);

  //add new point to graph
  graphDiffs[0] = difficulty;
  
  //place graph lines
  for (let i = 0; i < graphDiffs.length; i++) {
    var diffVal = graphDiffs[i];
    var xPos = 280 - (i * 10);
    var maxPercentage = diffVal/5;
    var yPos = 180 - (160*maxPercentage);

    var prevDiffVal = graphDiffs[i+1];
    var prevXPos = 280 - ((i+1) * 10);
    var prevMaxPercentage = prevDiffVal/5;
    var prevYPos = 180 - (160*prevMaxPercentage);

    if (i == 0) {
      //console.log(`${diffVal} ${prevDiffVal}`);
      line(xPos, yPos, prevXPos, prevYPos);
    }

    line(xPos, yPos, prevXPos, prevYPos);
  }

  //volume control based on difficulty
  if (difficulty < 2) {
    //(volume, fade time)
    sounds.birdAmbience.setVolume(1, 2);
    sounds.calmPad.setVolume(1, 2);
    sounds.mellowPad.setVolume(1, 2);
    sounds.tensePad.setVolume(0, 2);
    sounds.droneBass.setVolume(0, 2);
    sounds.droneHat.setVolume(0, 2);
    sounds.heartbeat.setVolume(0, 2);
  } else if (difficulty < 3) {
    sounds.birdAmbience.setVolume(1, 2);
    sounds.calmPad.setVolume(0.1, 2);
    sounds.mellowPad.setVolume(1, 2);
    sounds.tensePad.setVolume(0, 2);
    sounds.droneBass.setVolume(0, 2);
    sounds.droneHat.setVolume(0, 2);
    sounds.heartbeat.setVolume(0, 2);
  } else if (difficulty < 4) {
    sounds.birdAmbience.setVolume(1, 2);
    sounds.calmPad.setVolume(0, 2);
    sounds.mellowPad.setVolume(1, 2);
    sounds.tensePad.setVolume(0.6, 2);
    sounds.droneBass.setVolume(0, 2);
    sounds.droneHat.setVolume(0.6, 2);
    sounds.heartbeat.setVolume(0, 2);
  } else if (difficulty < 5) {
    sounds.birdAmbience.setVolume(0.5, 2);
    sounds.calmPad.setVolume(0, 2);
    sounds.mellowPad.setVolume(0.4, 2);
    sounds.tensePad.setVolume(1, 2);
    sounds.droneBass.setVolume(0.7, 2);
    sounds.droneHat.setVolume(1, 2);
    sounds.heartbeat.setVolume(0.5, 2);
  } else if (difficulty == 5) {
    sounds.birdAmbience.setVolume(0, 2);
    sounds.calmPad.setVolume(0, 2);
    sounds.mellowPad.setVolume(0, 2);
    sounds.tensePad.setVolume(1, 2);
    sounds.droneBass.setVolume(1, 2);
    sounds.droneHat.setVolume(1, 2);
    sounds.heartbeat.setVolume(1, 2);
  }
}

altitudeSlider.addEventListener("input", updateAltitude);
//document.addEventListener("mousemove", () => {getAudioContext().resume()});
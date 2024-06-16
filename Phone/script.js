var voicemailaudio = new Audio('./audio/voicemail.wav');
var security = new Audio('./audio/required.wav');
var question1 = new Audio('./audio/q1.wav');
var question2 = new Audio('./audio/q2.wav');
var question3 = new Audio('./audio/q3.wav');
var granted = new Audio('./audio/granted.wav');
var thunk = new Audio('./audio/thunk.wav');
var allAudios = [security, question1, question2, question3, granted];
var buttonAudios = {};
const STR_TO_NUM = {one: 1,  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, zero: 0, star:"*", pound:"#", reciever:"!"};
for (var i = 0; i < Object.keys(STR_TO_NUM).length; i++) {
  let keyKeys = Object.keys(STR_TO_NUM);
  buttonAudios[keyKeys[i]] = new Audio(`./audio/beeps/${keyKeys[i]}.wav`);
}
var questionsStarted = false;
var currentAudio = -1;
var searchParams = new URLSearchParams(window.location.search);
window.onload = (event) => {
//in case I want to make something run at launch
  var hat = document.getElementById("hat");
  hat.addEventListener("mousedown", takeHat);
  if(searchParams.size == 0) {
    const paramStr = "Booktable=false&Fuse%20Box1=false&Fuse%20Box2=false&Wall=false&Hat%20Rack1=false&Hat%20Rack2=false&Hat%20Rack3=false";
    searchParams = new URLSearchParams(paramStr);
  }
  if(searchParams.get("Hat Rack2") === "false") {
    hat.style.visibility = "visible";
  }
  let link = document.getElementById("backButton");
  link.href += `?${searchParams.toString()}`;
}

function takeHat(event) {
  this.style.visibility = "hidden";
  searchParams.set("Hat Rack2", true);
  let link = document.getElementById("backButton");
  link.href = link.href.split(`?`)[0];
  link.href += `?${searchParams.toString()}`;
}

function voicemail(button) {
  if(button.type != `ended`) {
    button.style.animationIterationCount = 0;
  }
  let screenText = document.getElementById('text');
  if(voicemailaudio.started) {
    voicemailaudio.pause();
    screenText.innerHTML = `No New Messages`;
    voicemailaudio.currentTime = 0;
    voicemailaudio.started = false;
  } else {
    voicemailaudio.started = true;
    screenText.innerHTML = `Playing . . .`;
    voicemailaudio.play();
    voicemailaudio.onended = voicemail;
  }
}

function keypad(id) {
  buttonAudios[id].play();
  if(voicemailaudio.started) {
    voicemailaudio.pause();
    voicemailaudio.currentTime = 0;
    voicemailaudio.started = false;
  }
  let screenText = document.getElementById('text');
  if(screenText.innerHTML.match(/[^$,.\d]/)) {
    screenText.innerHTML = '';
  }
  const number = STR_TO_NUM[id.toLowerCase()];
  if(!questionsStarted && number == "1") {
      questionsStarted = true;
      nextAudio();
  } else if(number == "!") {
      screenText.innerHTML = "";
      allAudios[currentAudio].pause();
      allAudios[currentAudio].currentTime = 0;
      if(currentAudio == 0 || currentAudio == 1) {
        questionsStarted = false;
        currentAudio = -1;
      }
      if(voicemailaudio.started) {
        voicemailaudio.pause();
        voicemailaudio.currentTime = 0;
        voicemailaudio.started = false;
      }
  } else if(number == "*" && questionsStarted) {
    if(currentAudio == 1 && screenText.innerHTML == `89`) {
      screenText.innerHTML += number;
      nextAudio();
    }
    if(currentAudio == 2 && screenText.innerHTML == `28`) {
      screenText.innerHTML += number;
      nextAudio();
    }
    if(currentAudio == 3 && screenText.innerHTML == `58`) {
      screenText.innerHTML += number;
      searchParams.set("Booktable", true);
      let link = document.getElementById("backButton");
      link.href = link.href.split(`?`)[0];
      link.href += `?${searchParams.toString()}`;
      nextAudio();
      setTimeout(() => {  thunk.play(); }, 1000);
    }
    else {
      repeatAudio();
    }
  }
  if(screenText.innerHTML.length < 10) {
    screenText.innerHTML += number;   
  }
}

function nextAudio() {
  if(voicemailaudio.started) {
    voicemailaudio.pause();
    voicemailaudio.currentTime = 0;
    voicemailaudio.started = false;
  }
 currentAudio++;
 let allText = [`ACCESS REQUIRED`, `MAKE AND MODEL`, `UNIVERSITY`, `SISTER'S NAME`, 'ACCESS GRANTED'];
 if(currentAudio > 0) {
  allAudios[currentAudio-1].pause();
 }
 allAudios[currentAudio].volume = 0.3;
 allAudios[currentAudio].play();
 if(currentAudio == 0) {
  allAudios[currentAudio].onended = nextAudio;
 }
 changeText(allText[currentAudio]);
}

function changeText(string) {
  let screenText = document.getElementById('text');
  screenText.innerHTML = '';
  screenText.innerHTML = string;
} 

function repeatAudio() {
  if(voicemailaudio.started) {
    voicemailaudio.pause();
    voicemailaudio.currentTime = 0;
    voicemailaudio.started = false;
  }
  let allText = [`ACCESS REQUIRED`, `MAKE AND MODEL`, `UNIVERSITY`, `SISTER'S NAME`, 'ACCESS GRANTED'];
  allAudios[currentAudio].pause();
  allAudios[currentAudio].currentTime = 0;
  allAudios[currentAudio].play();
  changeText(allText[currentAudio]);
}
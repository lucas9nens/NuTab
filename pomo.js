// Timer Display
const timerEl = document.getElementById("timer-display");
const startEl = document.getElementById("controls");
const resetEl = document.getElementById("reset")

const focusInt = document.getElementById("focus");
const shortBreak = document.getElementById("break");
const restInt = document.getElementById("rest");

const alert = new Audio('audio/alert-bells.wav');

let durations = [1500, 300, 900]; //25, 5, 15 mins
let sequence = [0,1, 0,1, 0,1, 0,2]; //focus, break, ..., focus, rest

let session  = 0;
let timeLeft = durations[sequence[session]];
let interval = null;
let started = false;

function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerEl.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateIntervalDisplay(){
    focusInt.classList.remove("active-status");
    shortBreak.classList.remove("active-status");
    restInt.classList.remove("active-status");
    if(durations[sequence[session]] === durations[0]){
        focusInt.classList.add("active-status");
    } else if(durations[sequence[session]] == durations[1]){
        shortBreak.classList.add("active-status");
    } else if(durations[sequence[session]] === durations[2]){
        restInt.classList.add("active-status");
    }
}

  
function startTimer() {
    if (started) return;
    
    alert.pause();
    alert.currentTime = 0;
    
    interval = setInterval(() => {
    timeLeft--;
    updateTimer();
    updateIntervalDisplay();


    if (timeLeft <= 0) {
        clearInterval(interval);
        started = false;
        startEl.innerText = "Start"


        session = (session + 1) % sequence.length;
        timeLeft = durations[sequence[session]];
        updateTimer();
        updateIntervalDisplay();
        alert.play();

        let loopCount = 3;

        alert.addEventListener('ended', function() {
        loopCount--;

        if (loopCount > 0) {
            alert.play();
        }
        });

        alert.play();
    }
    }, 1000);
    started = true;
    startEl.innerText = "Pause"
}

function stopTimer() {
    clearInterval(interval);
    started = false;
    startEl.innerText = "Start"

    alert.pause();
    alert.currentTime = 0;
}

function resetTimer() {
    clearInterval(interval);
    started = false;
    session = 0;
    timeLeft = durations[sequence[session]];
    startEl.innerText = "Start"
    updateTimer();
    updateIntervalDisplay();

    alert.pause();
    alert.currentTime = 0;
}


startEl.addEventListener("click", function(){
    if(started){
        stopTimer();
    }
    else{
        startTimer();
    }
});


resetEl.addEventListener("click", resetTimer);
updateTimer();





// ========================================
// LJUD
// ========================================

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playBeep() {

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.15
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.15
    );
}


// ========================================
// VARIABLER
// ========================================

let timer;

let timeLeft;

let currentRepetition = 1;

let intervalSeconds;

let restSeconds;

let totalRepetitions;


// ========================================
// HÄMTA ELEMENT FRÅN HTML
// ========================================

const startButton =
    document.getElementById("startButton");

const stopButton =
    document.getElementById("stopButton");

const timerSection =
    document.getElementById("timerSection");

const phaseDisplay =
    document.getElementById("phase");

const timerDisplay =
    document.getElementById("timer");

const repetitionDisplay =
    document.getElementById("repetition");


// ========================================
// STARTA TRÄNING
// ========================================

startButton.addEventListener("click", function () {

    // Aktivera ljudet
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }


    // Hämta användarens inställningar

    const intervalMinutes =
        Number(
            document.getElementById("intervalTime").value
        );

    const restMinutes =
        Number(
            document.getElementById("restTime").value
        );

    totalRepetitions =
        Number(
            document.getElementById("repetitions").value
        );


    // Omvandla minuter till sekunder

    intervalSeconds =
        intervalMinutes * 60;

    restSeconds =
        restMinutes * 60;


    // Börja på repetition 1

    currentRepetition = 1;


    // Visa timer

    timerSection.style.display = "block";


    // Dölj startknappen

    startButton.style.display = "none";


    // Starta första intervallet

    startInterval();

});


// ========================================
// STARTA INTERVALL
// ========================================

function startInterval() {

    phaseDisplay.textContent =
        "INTERVALL";


    timeLeft =
        intervalSeconds;


    updateDisplay();


    // Säkerställ att det inte finns någon gammal timer

    clearInterval(timer);


    // Starta nedräkningen

    timer = setInterval(function () {

        timeLeft--;


        updateDisplay();


        // Pip vid 3, 2 och 1 sekund kvar

        if (
            timeLeft <= 3 &&
            timeLeft > 0
        ) {

            playBeep();

        }


        // När intervallet är slut

        if (timeLeft <= 0) {

            clearInterval(timer);


            // Finns det fler repetitioner?

            if (
                currentRepetition <
                totalRepetitions
            ) {

                startRest();

            } else {

                finishWorkout();

            }

        }

    }, 1000);

}


// ========================================
// STARTA VILA
// ========================================

function startRest() {

    phaseDisplay.textContent =
        "VILA";


    timeLeft =
        restSeconds;


    updateDisplay();


    clearInterval(timer);


    // Starta nedräkningen

    timer = setInterval(function () {

        timeLeft--;


        updateDisplay();


        // Pip vid 3, 2 och 1 sekund kvar

        if (
            timeLeft <= 3 &&
            timeLeft > 0
        ) {

            playBeep();

        }


        // När vilan är slut

        if (timeLeft <= 0) {

            clearInterval(timer);


            // Gå till nästa repetition

            currentRepetition++;


            startInterval();

        }

    }, 1000);

}


// ========================================
// UPPDATERA DISPLAY
// ========================================

function updateDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);


    const seconds =
        timeLeft % 60;


    timerDisplay.textContent =

        String(minutes).padStart(2, "0")

        + ":"

        + String(seconds).padStart(2, "0");


    repetitionDisplay.textContent =

        "Repetition "

        + currentRepetition

        + " / "

        + totalRepetitions;

}


// ========================================
// TRÄNING KLAR
// ========================================

function finishWorkout() {

    clearInterval(timer);


    phaseDisplay.textContent =
        "KLAR! 🎉";


    timerDisplay.textContent =
        "00:00";


    repetitionDisplay.textContent =
        "Bra jobbat!";


    startButton.textContent =
        "STARTA IGEN";


    startButton.style.display =
        "block";

}


// ========================================
// STOPPA TRÄNING
// ========================================

stopButton.addEventListener("click", function () {

    clearInterval(timer);


    timerSection.style.display =
        "none";


    startButton.style.display =
        "block";


    startButton.textContent =
        "STARTA TRÄNING";

});
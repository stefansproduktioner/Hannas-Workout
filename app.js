// ==========================================
// HANNAS WORKOUT
// ==========================================


// ==========================================
// LJUD
// ==========================================

let audioContext = null;


function initAudio() {

    if (!audioContext) {

        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();

    }

    if (audioContext.state === "suspended") {

        audioContext.resume();

    }
}


function playBeep() {

    if (!audioContext) {
        return;
    }

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
        0.001,
        audioContext.currentTime + 0.15
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.15
    );
}


// ==========================================
// VIBRATION
// ==========================================

function vibrate() {

    if ("vibrate" in navigator) {

        navigator.vibrate(100);

    }

}


// ==========================================
// DOM
// ==========================================

const standardModeButton =
    document.getElementById("standardModeButton");

const stairModeButton =
    document.getElementById("stairModeButton");


const standardSettings =
    document.getElementById("standardSettings");

const stairSettings =
    document.getElementById("stairSettings");


const intervalSelect =
    document.getElementById("interval");

const restSelect =
    document.getElementById("rest");

const repetitionsSelect =
    document.getElementById("repetitions");


const stairCountSelect =
    document.getElementById("stairCount");

const stairIntervals =
    document.getElementById("stairIntervals");

const stairRestSelect =
    document.getElementById("stairRest");


const startButton =
    document.getElementById("startButton");

const stopButton =
    document.getElementById("stopButton");

const againButton =
    document.getElementById("againButton");


const settingsSection =
    document.getElementById("settings");

const timerSection =
    document.getElementById("timerSection");

const finishedSection =
    document.getElementById("finishedSection");


const phaseDisplay =
    document.getElementById("phaseDisplay");

const timerDisplay =
    document.getElementById("timerDisplay");

const repetitionDisplay =
    document.getElementById("repetitionDisplay");


// ==========================================
// VARIABLER
// ==========================================

let timer = null;

let timeLeft = 0;

let intervalIndex = 0;

let intervalDurations = [];

let restSeconds = 40;

let workoutMode = "standard";


// ==========================================
// SKAPA TRAPPINTERVALL
// ==========================================

function createStairIntervals() {

    const count =
        parseInt(stairCountSelect.value);


    stairIntervals.innerHTML = "";


    const title =
        document.createElement("div");

    title.className = "stair-title";

    title.textContent =
        "Ställ in varje intervall:";

    stairIntervals.appendChild(title);


    for (let i = 0; i < count; i++) {

        const wrapper =
            document.createElement("div");

        wrapper.className = "stair-item";


        const label =
            document.createElement("label");

        label.textContent =
            "Intervall " + (i + 1);


        const select =
            document.createElement("select");

        select.className =
            "stair-duration";


        select.dataset.index = i;


        const values = [
            20,
            40,
            60,
            80,
            100,
            120,
            140,
            160,
            180
        ];


        values.forEach(seconds => {

            const option =
                document.createElement("option");

            option.value = seconds;

            option.textContent =
                formatTime(seconds);


            // Första versionen av trappan:
            // 1:00 -> 0:40 -> 0:20 ->
            // 0:40 -> 1:00

            const defaultPattern = [
                60,
                40,
                20,
                40,
                60
            ];


            if (
                i < defaultPattern.length &&
                seconds === defaultPattern[i]
            ) {

                option.selected = true;

            }


            select.appendChild(option);

        });


        wrapper.appendChild(label);

        wrapper.appendChild(select);

        stairIntervals.appendChild(wrapper);

    }

}


// ==========================================
// FORMATERA TID
// ==========================================

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );

}


// ==========================================
// BYT TILL STANDARD
// ==========================================

standardModeButton.addEventListener(
    "click",
    function () {

        workoutMode = "standard";


        standardModeButton.classList.add("active");

        stairModeButton.classList.remove("active");


        standardSettings.classList.remove("hidden");

        stairSettings.classList.add("hidden");

    }
);


// ==========================================
// BYT TILL TRAPPA
// ==========================================

stairModeButton.addEventListener(
    "click",
    function () {

        workoutMode = "stair";


        stairModeButton.classList.add("active");

        standardModeButton.classList.remove("active");


        stairSettings.classList.remove("hidden");

        standardSettings.classList.add("hidden");


        createStairIntervals();

    }
);


// ==========================================
// ÄNDRA ANTAL TRAPPINTERVALLER
// ==========================================

stairCountSelect.addEventListener(
    "change",
    function () {

        createStairIntervals();

    }
);


// Skapa trappan direkt
createStairIntervals();


// ==========================================
// STARTA TRÄNING
// ==========================================

startButton.addEventListener(
    "click",
    function () {

        initAudio();


        if (workoutMode === "standard") {

            const intervalSeconds =
                parseInt(intervalSelect.value);


            const repetitions =
                parseInt(repetitionsSelect.value);


            restSeconds =
                parseInt(restSelect.value);


            intervalDurations = [];


            for (
                let i = 0;
                i < repetitions;
                i++
            ) {

                intervalDurations.push(
                    intervalSeconds
                );

            }

        } else {

            restSeconds =
                parseInt(stairRestSelect.value);


            const stairSelects =
                document.querySelectorAll(
                    ".stair-duration"
                );


            intervalDurations = [];


            stairSelects.forEach(select => {

                intervalDurations.push(
                    parseInt(select.value)
                );

            });

        }


        if (intervalDurations.length === 0) {
            return;
        }


        intervalIndex = 0;


        settingsSection.classList.add("hidden");

        finishedSection.classList.add("hidden");

        timerSection.classList.remove("hidden");


        startInterval();

    }
);


// ==========================================
// STARTA INTERVALL
// ==========================================

function startInterval() {

    clearInterval(timer);


    timeLeft =
        intervalDurations[intervalIndex];


    phaseDisplay.textContent =
        "INTERVALL";


    timerSection.classList.remove(
        "rest-mode"
    );


    timerSection.classList.add(
        "interval-mode"
    );


    updateDisplay();


    timer = setInterval(
        function () {

            timeLeft--;


            updateDisplay();


            // Nedräkning 3 - 2 - 1

            if (
                timeLeft <= 3 &&
                timeLeft > 0
            ) {

                playBeep();

                vibrate();

            }


            if (timeLeft <= 0) {

                clearInterval(timer);


                if (
                    intervalIndex <
                    intervalDurations.length - 1
                ) {

                    startRest();

                } else {

                    finishWorkout();

                }

            }

        },
        1000
    );

}


// ==========================================
// STARTA VILA
// ==========================================

function startRest() {

    clearInterval(timer);


    timeLeft = restSeconds;


    phaseDisplay.textContent =
        "VILA";


    timerSection.classList.remove(
        "interval-mode"
    );


    timerSection.classList.add(
        "rest-mode"
    );


    updateDisplay();


    timer = setInterval(
        function () {

            timeLeft--;


            updateDisplay();


            // Nedräkning 3 - 2 - 1

            if (
                timeLeft <= 3 &&
                timeLeft > 0
            ) {

                playBeep();

                vibrate();

            }


            if (timeLeft <= 0) {

                clearInterval(timer);


                intervalIndex++;


                startInterval();

            }

        },
        1000
    );

}


// ==========================================
// UPPDATERA DISPLAY
// ==========================================

function updateDisplay() {

    timerDisplay.textContent =
        formatTime(timeLeft);


    repetitionDisplay.textContent =
        "Intervall " +
        (intervalIndex + 1) +
        " / " +
        intervalDurations.length;

}


// ==========================================
// TRÄNING KLAR
// ==========================================

function finishWorkout() {

    clearInterval(timer);


    timerSection.classList.add("hidden");

    finishedSection.classList.remove("hidden");


    // Långare signal när träningen är klar

    playFinishSound();

}


// ==========================================
// KLAR-LJUD
// ==========================================

function playFinishSound() {

    if (!audioContext) {
        return;
    }


    const oscillator =
        audioContext.createOscillator();

    const gainNode =
        audioContext.createGain();


    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);


    oscillator.type = "sine";


    oscillator.frequency.setValueAtTime(
        600,
        audioContext.currentTime
    );


    oscillator.frequency.setValueAtTime(
        900,
        audioContext.currentTime + 0.2
    );


    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );


    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.5
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.5
    );

}


// ==========================================
// STOPPA
// ==========================================

stopButton.addEventListener(
    "click",
    function () {

        clearInterval(timer);


        timerSection.classList.add("hidden");

        finishedSection.classList.add("hidden");

        settingsSection.classList.remove("hidden");


        timerSection.classList.remove(
            "interval-mode"
        );

        timerSection.classList.remove(
            "rest-mode"
        );

    }
);


// ==========================================
// KÖR IGEN
// ==========================================

againButton.addEventListener(
    "click",
    function () {

        finishedSection.classList.add("hidden");

        settingsSection.classList.remove("hidden");

    }
);
// ==========================================
// HANNAS WORKOUT
// ==========================================


// ==========================================
// LJUD
// ==========================================

let audioContext = null;


function createAudioContext() {

    if (audioContext) {
        return audioContext;
    }


    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContextClass) {

        console.log(
            "Web Audio stöds inte av denna webbläsare."
        );

        return null;
    }


    audioContext =
        new AudioContextClass();


    return audioContext;
}


// Den här funktionen körs direkt när
// användaren trycker på STARTA.

async function prepareAudio() {

    const context =
        createAudioContext();


    if (!context) {
        return;
    }


    try {

        if (context.state === "suspended") {

            await context.resume();

        }

    } catch (error) {

        console.log(
            "Kunde inte starta ljudet:",
            error
        );

    }

}


// ==========================================
// PIP
// ==========================================

function playBeep() {

    const context =
        createAudioContext();


    if (!context) {
        return;
    }


    try {

        // Försök väcka ljudmotorn igen
        // om webbläsaren har pausat den.

        if (context.state === "suspended") {

            context.resume();

        }


        const oscillator =
            context.createOscillator();


        const gainNode =
            context.createGain();


        oscillator.connect(
            gainNode
        );


        gainNode.connect(
            context.destination
        );


        oscillator.type =
            "sine";


        oscillator.frequency.setValueAtTime(
            880,
            context.currentTime
        );


        gainNode.gain.setValueAtTime(
            0.001,
            context.currentTime
        );


        gainNode.gain.exponentialRampToValueAtTime(
            0.35,
            context.currentTime + 0.01
        );


        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + 0.18
        );


        oscillator.start(
            context.currentTime
        );


        oscillator.stop(
            context.currentTime + 0.2
        );

    } catch (error) {

        console.log(
            "Kunde inte spela pip:",
            error
        );

    }

}


// ==========================================
// KLAR-LJUD
// ==========================================

function playFinishSound() {

    const context =
        createAudioContext();


    if (!context) {
        return;
    }


    try {

        if (context.state === "suspended") {

            context.resume();

        }


        const oscillator =
            context.createOscillator();


        const gainNode =
            context.createGain();


        oscillator.connect(
            gainNode
        );


        gainNode.connect(
            context.destination
        );


        oscillator.type =
            "sine";


        oscillator.frequency.setValueAtTime(
            600,
            context.currentTime
        );


        oscillator.frequency.setValueAtTime(
            800,
            context.currentTime + 0.18
        );


        oscillator.frequency.setValueAtTime(
            1000,
            context.currentTime + 0.36
        );


        gainNode.gain.setValueAtTime(
            0.001,
            context.currentTime
        );


        gainNode.gain.exponentialRampToValueAtTime(
            0.35,
            context.currentTime + 0.02
        );


        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + 0.55
        );


        oscillator.start(
            context.currentTime
        );


        oscillator.stop(
            context.currentTime + 0.6
        );

    } catch (error) {

        console.log(
            "Kunde inte spela slutsignal:",
            error
        );

    }

}


// ==========================================
// VIBRATION
// ==========================================

function vibrate() {

    if (
        "vibrate" in navigator &&
        typeof navigator.vibrate === "function"
    ) {

        try {

            const result =
                navigator.vibrate(120);


            if (!result) {

                console.log(
                    "Webbläsaren kunde inte vibrera."
                );

            }

        } catch (error) {

            console.log(
                "Vibration stöds inte:",
                error
            );

        }

    } else {

        console.log(
            "Vibration API stöds inte."
        );

    }

}


// ==========================================
// SCREEN WAKE LOCK
// ==========================================

let wakeLock = null;

let workoutIsRunning = false;


// Begär att skärmen hålls aktiv.

async function requestWakeLock() {

    if (
        !("wakeLock" in navigator)
    ) {

        wakeLockStatus.textContent =
            "Skärmaktivitet stöds inte här";

        return;

    }


    if (
        document.visibilityState !== "visible"
    ) {

        return;

    }


    try {

        wakeLock =
            await navigator.wakeLock.request(
                "screen"
            );


        wakeLockStatus.textContent =
            "🔒 Skärmen hålls aktiv";


        // Om systemet själv släpper wake lock
        // försöker vi få tillbaka den senare.

        wakeLock.addEventListener(
            "release",
            function () {

                wakeLock = null;


                if (workoutIsRunning) {

                    wakeLockStatus.textContent =
                        "🔄 Försöker hålla skärmen aktiv";

                }

            }
        );


    } catch (error) {

        console.log(
            "Wake Lock kunde inte aktiveras:",
            error
        );


        wakeLockStatus.textContent =
            "Skärmen kan stängas av av systemet";

    }

}


// Släpp wake lock när träningen är klar.

async function releaseWakeLock() {

    if (!wakeLock) {
        return;
    }


    try {

        await wakeLock.release();

    } catch (error) {

        console.log(
            "Kunde inte släppa Wake Lock:",
            error
        );

    }


    wakeLock = null;

}


// Om användaren exempelvis går till en annan app
// kan Wake Lock släppas. När sidan blir synlig
// igen försöker vi aktivera den på nytt.

document.addEventListener(
    "visibilitychange",
    async function () {

        if (
            document.visibilityState === "visible" &&
            workoutIsRunning &&
            !wakeLock
        ) {

            await requestWakeLock();

        }

    }
);


// ==========================================
// DOM
// ==========================================

const standardModeButton =
    document.getElementById(
        "standardModeButton"
    );


const stairModeButton =
    document.getElementById(
        "stairModeButton"
    );


const standardSettings =
    document.getElementById(
        "standardSettings"
    );


const stairSettings =
    document.getElementById(
        "stairSettings"
    );


const intervalSelect =
    document.getElementById(
        "interval"
    );


const restSelect =
    document.getElementById(
        "rest"
    );


const repetitionsSelect =
    document.getElementById(
        "repetitions"
    );


const stairCountSelect =
    document.getElementById(
        "stairCount"
    );


const stairIntervals =
    document.getElementById(
        "stairIntervals"
    );


const stairRestSelect =
    document.getElementById(
        "stairRest"
    );


const startButton =
    document.getElementById(
        "startButton"
    );


const stopButton =
    document.getElementById(
        "stopButton"
    );


const againButton =
    document.getElementById(
        "againButton"
    );


const settingsSection =
    document.getElementById(
        "settings"
    );


const timerSection =
    document.getElementById(
        "timerSection"
    );


const finishedSection =
    document.getElementById(
        "finishedSection"
    );


const phaseDisplay =
    document.getElementById(
        "phaseDisplay"
    );


const timerDisplay =
    document.getElementById(
        "timerDisplay"
    );


const repetitionDisplay =
    document.getElementById(
        "repetitionDisplay"
    );


const wakeLockStatus =
    document.getElementById(
        "wakeLockStatus"
    );


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
// FORMATERA TID
// ==========================================

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        seconds % 60;


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );

}


// ==========================================
// SKAPA TRAPPA
// ==========================================

function createStairIntervals() {

    const count =
        parseInt(
            stairCountSelect.value
        );


    stairIntervals.innerHTML = "";


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "stair-title";


    title.textContent =
        "Ställ in varje intervall:";


    stairIntervals.appendChild(
        title
    );


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


    const defaultPattern = [
        60,
        40,
        20,
        40,
        60
    ];


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "stair-item";


        const label =
            document.createElement(
                "label"
            );


        label.textContent =
            "Intervall " +
            (i + 1);


        const select =
            document.createElement(
                "select"
            );


        select.className =
            "stair-duration";


        select.dataset.index =
            i;


        values.forEach(
            function (seconds) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    seconds;


                option.textContent =
                    formatTime(
                        seconds
                    );


                if (
                    i <
                    defaultPattern.length &&
                    seconds ===
                    defaultPattern[i]
                ) {

                    option.selected =
                        true;

                }


                select.appendChild(
                    option
                );

            }
        );


        wrapper.appendChild(
            label
        );


        wrapper.appendChild(
            select
        );


        stairIntervals.appendChild(
            wrapper
        );

    }

}


// ==========================================
// STANDARDLÄGE
// ==========================================

standardModeButton.addEventListener(
    "click",
    function () {

        workoutMode =
            "standard";


        standardModeButton.classList.add(
            "active"
        );


        stairModeButton.classList.remove(
            "active"
        );


        standardSettings.classList.remove(
            "hidden"
        );


        stairSettings.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// TRAPPLÄGE
// ==========================================

stairModeButton.addEventListener(
    "click",
    function () {

        workoutMode =
            "stair";


        stairModeButton.classList.add(
            "active"
        );


        standardModeButton.classList.remove(
            "active"
        );


        stairSettings.classList.remove(
            "hidden"
        );


        standardSettings.classList.add(
            "hidden"
        );


        createStairIntervals();

    }
);


// ==========================================
// ÄNDRA ANTAL TRAPPINTERVALL
// ==========================================

stairCountSelect.addEventListener(
    "change",
    function () {

        createStairIntervals();

    }
);


// Skapa standardtrappan direkt.

createStairIntervals();


// ==========================================
// STARTA
// ==========================================

startButton.addEventListener(
    "click",
    async function () {

        // Väldigt viktigt:
        // ljudmotorn startas direkt efter
        // användarens tryck på STARTA.

        await prepareAudio();


        // Försök hålla skärmen aktiv.

        await requestWakeLock();


        workoutIsRunning =
            true;


        // ==================================
        // STANDARD
        // ==================================

        if (
            workoutMode ===
            "standard"
        ) {

            const intervalSeconds =
                parseInt(
                    intervalSelect.value
                );


            const repetitions =
                parseInt(
                    repetitionsSelect.value
                );


            restSeconds =
                parseInt(
                    restSelect.value
                );


            intervalDurations =
                [];


            for (
                let i = 0;
                i < repetitions;
                i++
            ) {

                intervalDurations.push(
                    intervalSeconds
                );

            }

        }


        // ==================================
        // TRAPPA
        // ==================================

        else {

            restSeconds =
                parseInt(
                    stairRestSelect.value
                );


            const stairSelects =
                document.querySelectorAll(
                    ".stair-duration"
                );


            intervalDurations =
                [];


            stairSelects.forEach(
                function (select) {

                    intervalDurations.push(
                        parseInt(
                            select.value
                        )
                    );

                }
            );

        }


        if (
            intervalDurations.length === 0
        ) {

            workoutIsRunning =
                false;

            await releaseWakeLock();

            return;

        }


        intervalIndex =
            0;


        settingsSection.classList.add(
            "hidden"
        );


        finishedSection.classList.add(
            "hidden"
        );


        timerSection.classList.remove(
            "hidden"
        );


        // Uppdatera timer direkt.

        startInterval();

    }
);


// ==========================================
// STARTA INTERVALL
// ==========================================

function startInterval() {

    clearInterval(timer);


    timeLeft =
        intervalDurations[
            intervalIndex
        ];


    phaseDisplay.textContent =
        "INTERVALL";


    timerSection.classList.remove(
        "rest-mode"
    );


    timerSection.classList.add(
        "interval-mode"
    );


    updateDisplay();


    timer =
        setInterval(
            function () {

                timeLeft--;


                updateDisplay();


                // 3 - 2 - 1

                if (
                    timeLeft <= 3 &&
                    timeLeft > 0
                ) {

                    playBeep();

                    vibrate();

                }


                if (
                    timeLeft <= 0
                ) {

                    clearInterval(
                        timer
                    );


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


    timeLeft =
        restSeconds;


    phaseDisplay.textContent =
        "VILA";


    timerSection.classList.remove(
        "interval-mode"
    );


    timerSection.classList.add(
        "rest-mode"
    );


    updateDisplay();


    timer =
        setInterval(
            function () {

                timeLeft--;


                updateDisplay();


                // 3 - 2 - 1

                if (
                    timeLeft <= 3 &&
                    timeLeft > 0
                ) {

                    playBeep();

                    vibrate();

                }


                if (
                    timeLeft <= 0
                ) {

                    clearInterval(
                        timer
                    );


                    intervalIndex++;


                    startInterval();

                }

            },
            1000
        );

}


// ==========================================
// DISPLAY
// ==========================================

function updateDisplay() {

    timerDisplay.textContent =
        formatTime(
            timeLeft
        );


    repetitionDisplay.textContent =
        "Intervall " +
        (intervalIndex + 1) +
        " / " +
        intervalDurations.length;

}


// ==========================================
// KLAR
// ==========================================

async function finishWorkout() {

    clearInterval(timer);


    workoutIsRunning =
        false;


    await releaseWakeLock();


    timerSection.classList.add(
        "hidden"
    );


    finishedSection.classList.remove(
        "hidden"
    );


    playFinishSound();


    // Även en liten vibration vid slutet
    // om enheten stöder vibration.

    vibrate();

}


// ==========================================
// STOPPA
// ==========================================

stopButton.addEventListener(
    "click",
    async function () {

        clearInterval(timer);


        workoutIsRunning =
            false;


        await releaseWakeLock();


        timerSection.classList.add(
            "hidden"
        );


        finishedSection.classList.add(
            "hidden"
        );


        settingsSection.classList.remove(
            "hidden"
        );


        timerSection.classList.remove(
            "interval-mode"
        );


        timerSection.classList.remove(
            "rest-mode"
        );


        wakeLockStatus.textContent =
            "🔒 Skärmen hålls aktiv";

    }
);


// ==========================================
// KÖR IGEN
// ==========================================

againButton.addEventListener(
    "click",
    function () {

        finishedSection.classList.add(
            "hidden"
        );


        settingsSection.classList.remove(
            "hidden"
        );

    }
);
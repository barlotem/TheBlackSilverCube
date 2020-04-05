var sw = document.getElementsByClassName('stopwatch');
var pazzle = '3',
    kind = '1',
    session = '1',
    name = "P" + pazzle + "K" + kind + "S" + session;
var inShowingScramble = false;

var currentTimer = 0,
    lastTimer = null,
    interval = 0,
    lastUpdateTime = new Date().getTime(),
    timeBox = $('div#timeBox'),
    numberOfSolveBox = $('span#numberOfSolves'),
    bestTimeBox = $('span#bestTime'),
    worstTimeBox = $('span#worstTime'),
    avgTimeBox = $('span#average'),
    bestAvgOfFiveBox = $('span#bestAverageOfFive'),
    currentAvgOfFiveBox = $('span#currentAverageOfFive'),
//    lastTimeRestart = $('span#lastRestartTime'),
//    lastSolveTime = $('span#lastSolveTime'),
    scrambleBox = $('div#scrambleBox'),
    timesSideBox = $('div#timeTextBox'),
    backgroundOfModal = $('div.sweet-overlay'),
    dnfButton = $('button#dnfButton'),
    plus2Button = $('button#plus2Button'),
    currentScramble = getScramble(),
    lastTimeRestartDate = new Date(), //get From local Storage;
    lastSolveDate = new Date(), //get From local Storage;
    selectedTime = null,
    cubeImgDiv = '#cubeImg';

backgroundOfModal.click(function () {
    swal.close();
});


initPage();

function initPage() {
    updateSite();
    scrambleBox.html(currentScramble);
    updateCubeImg(currentScramble);
    if (localStorage.getItem(name) == undefined) {
        localStorage.setItem(name, '');
    } else {
        setTimeArray(localStorage.getItem(name).split(','));
        lastTimer = getLastTime();
        reloadTimesBoxBody();
    }
}

function update() {

    currentTimer += new Date().getTime() - lastUpdateTime;;
    lastUpdateTime = new Date().getTime();

    timeBox.html(timeToShow(new Date(currentTimer)));
}

function startTimer() {
    // check if done showing the last scramble
    if (!inShowingScramble) {
        currentTimer = 0;
        lastUpdateTime = new Date().getTime();
        interval = setInterval(update, 1);
    }
}

function stopTimer() {
    clearInterval(interval);
    interval = 0;

    lastSolveDate = new Date();
    lastTimer = currentTimer;

    if (currentTimer) {
        addTimeToArray(currentTimer);
        updateSite();
    }

    currentScramble = getScramble();
    scrambleTypingAnimation(currentScramble);
    reloadTimesBoxBody();
    dnfButton.removeAttr('disabled');
    plus2Button.removeAttr('disabled');
}

document.addEventListener("keydown", function (event) {
    // user press on space key
    if (event.which == 32) {
        if (!interval) {
            event.preventDefault();
            document.getElementById('scrambleBox').focus();
            startTimer();

        } else {
            stopTimer();
        }
    }
});

function updateSite() {
    saveSession();
    reloadStatistics();
    if (getTimeArray().length > 0) {
        timeBox.html(timeToShow(getTimeArray()[getTimeArray().length - 1]));
    } else {
        timeBox.html("0.00");
    }
    reloadTimesBoxBody();
}

function updateCubeImg(scramble) {
//    TTk.InteractivePuzzle.palette = {
//	'y': '#E6D223', // Yellow
//	'r': '#EB4549', // Red
//	'o': '#E67E22', // Orange
//	'b': '#2F79C3', // Blue
//	'g': '#3BC391', // Green
//	'w': '#F8F2E2' // White
//};
    
    scramble = "r2 L2 "+ scramble;
    d3.selectAll(cubeImgDiv + ' svg').remove();
    var cubeImg = TTk.InteractivePuzzle(pazzle).rotate(true).size({width:150, height:150});
    cubeImg.moveInteract().mouse(true).keyboard(true);
    cubeImg.alg(scramble)(cubeImgDiv);

    
    
}

async function scrambleTypingAnimation(scramble) {
    updateCubeImg(scramble);
    if (!inShowingScramble) {
        inShowingScramble = true;

        var chars = scramble.split('');
        scrambleBox.html("");

        for (i = 0; i < chars.length; i++) {
            scrambleBox.append(chars[i]);
            await sleep(10);
        }

        inShowingScramble = false;
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function reloadStatistics() {
    numberOfSolveBox.html(timesArray.length);
    timeArrayLength = getTimeArray().length;

    if (timeArrayLength >= 5) {
        bestAvgOfFiveBox.html(timeToShow(findBestAvgOfFive()));
        currentAvgOfFiveBox.html(timeToShow(findAvgOfFive(getTimeArray().length - 5)));
    } else {
        bestAvgOfFiveBox.html("x");
        currentAvgOfFiveBox.html("x");
    }

    if (timeArrayLength > 0) {
        bestTimeBox.html(timeToShow(findBest()));
        worstTimeBox.html(timeToShow(findWorst()));
        worstTimeBox.html(timeToShow(findWorst()));
        avgTimeBox.html(timeToShow(findAvg()));
    } else {
        bestTimeBox.html("x");
        worstTimeBox.html("x");
        avgTimeBox.html("x");
    }

//    lastSolveTime.html(lastSolveDate.getDate() + "/" + (lastSolveDate.getMonth() + 1) + "/" + lastSolveDate.getFullYear() + " " + pad(lastSolveDate.getHours()) + ":" + pad(lastSolveDate.getMinutes()));

  /*  lastTimeRestart.html(lastTimeRestartDate.getDate() + "/" + (lastTimeRestartDate.getMonth() + 1) + "/" + lastTimeRestartDate.getFullYear() + " " + pad(lastTimeRestartDate.getHours()) + ":" + pad(lastTimeRestartDate.getMinutes()));*/
}


function selectTime(index) {
    selectedTime = index;
    $(".timeSpan").removeClass('TimebuttonClicked');
    $(".timeIndex" + index).addClass('TimebuttonClicked');


}

function deleteTime(index) {
    if (index == timesArray.length - 1) {
        dnfButton.attr("disabled", true);
        plus2Button.attr("disabled", true);
    }
    deleteTimeFromArray(index);
    reloadTimesBoxBody();
    updateSite();
}

function deleteSelectedTime() {
    if (selectedTime != null) {
        deleteTime(selectedTime);
    }

    selectedTime = null;
}

function deleteAllTimes() {
    swal({
            title: "Are you sure you want to delete all times?",
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Do it",
            cancelButtonText: "No, I regret",
            closeOnConfirm: false,
            animation: "slide-from-top",
        },
        function (isConfirm) {

            // delete time confirm
            if (isConfirm) {
                lastTimeRestartDate = new Date();
                setTimeArray([]);
                reloadTimesBoxBody();
                updateSite();
                swal("All time deleted", "", "success");
            }
        });


}

function getComment(index) {

}


function reloadTimesBoxBody() {
    timesSideBox.html("");
    if (timesArray[0] != "") {
        for (var i = 0; i < timesArray.length; i++) {
            timesSideBox.append("<span class='timeSpan timeIndex" + i + "' onclick=selectTime(" + i + ")>" + timeToShow(timesArray[i]) + "</span>");
        }
    }
}

function timeToShow(duration) {

    if (duration == "-1") {
        return "DNF";
    }
    var mil, sec, min;

    //show only two digits of milliseconds
    mil = (('00' + parseInt((duration % 1000))).substr(-3)).substr(0, 2);
    sec = (parseInt((duration / 1000) % 60));
    min = (parseInt((duration / (1000 * 60)) % 60));


    // return only neccessery digits in format 00:00:00
    if (parseInt(min)) {
        return min + ":" + pad(sec) + "." + mil;
    }
    if (parseInt(sec)) {
        return sec + "." + mil;
    }
    return "0." + mil;
}


function pad(number) {
    return ('00' + number).substr(-2);
}

function deleteLastTime() {
    deleteTime(timesArray.length - 1);
}

dnfAdded = false;

function dnfLastTime() {
    if (!dnfAdded) {
        updateLastTime(-1);
    } else {
        updateLastTime(lastTimer);
    }
    dnfAdded = !dnfAdded;
    updateSite();
}

plus2Added = false;

function plus2LastTime() {
    if (!plus2Added) {
        updateLastTime(lastTimer + 2000);
    } else {
        updateLastTime(lastTimer);
    }
    plus2Added = !plus2Added;
    updateSite();
}

function saveSession() {
    var id = kind;
    var name = "P" + pazzle + "K" + kind + "S" + session;

    if (window.localStorage !== undefined) {
        var value = "";
        for (var i = 0; i < timesArray.length; i++) {
            value += timesArray[i];
            //                if (comments[i] != "" && comments[i] !== null) {
            //                    value += "|" + comments[i];
            //                }
            //                if (notes[i] == 1) value += "-";
            //                if (notes[i] == 2) value += "+";
            if (i < timesArray.length - 1 && timesArray.length != 0) value += ",";
        }

        window.localStorage.setItem(name, value);
    }
}

// add setting page - site color, animate in load, show live perview, show statistics..
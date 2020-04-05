var timesArray = [];

function setTimeArray(newTimeArray) {

    if (newTimeArray[0] != "") {
        timesArray = newTimeArray;
    }

    // parse from strings to integers
    for (var i = 0; i < timesArray.length; i++) {
        timesArray[i] = parseInt(timesArray[i]);
    }
}

function getTimeArray() {
    return timesArray;
}

function getTimeByIndex(index) {
    return timesArray[index];
}

function removeTime() {
    timesArray.pop();
}


function findWorst() {
    var worst = timesArray[0];
    var foundDNF = false;
    if (timesArray.length) {
        timesArray.forEach(function (current) {
            if (current > worst) {
                worst = current;
            }
            if (current == -1) {
                foundDNF = true;
            }
        });

        if (foundDNF) {
            worst = -1;
        }

        return worst;
    }

    return undefined;

}

function findBest() {
    var best = timesArray[0];
    if (timesArray.length) {
        timesArray.forEach(function (current) {
            if (current < best && current != -1) {
                best = current;
            }

        });

        return best;
    }

    return undefined;

}

function findBestAvgOfFive() {

    var bestAvg = findAvgOfFive(0);
    var index;

    for (index = 0; index <= timesArray.length - 5; index++) {

        if (findAvgOfFive(index) < bestAvg) {
            bestAvg = findAvgOfFive(index);
        }
    }

    return bestAvg;
}

function findAvgOfFive(index) {
    var avg;
    var currentSum = 0;
    var bestInFive;
    var worstInFive;
    var dnfCounter = 0;
    var currentTime;

    for (var counter = 0; counter < 5; counter++) {
        currentTime = timesArray[index + counter];

        // restart variables of currentAverage when counter = 0
        if (!counter) {
            if (currentTime != -1){
                bestInFive = currentTime;
            } else {
                bestInFive = timesArray[index + 1];
            }
            
            worstInFive = currentTime;
        }
        currentSum += currentTime;

        if (currentTime != -1) {
            bestInFive = currentTime < bestInFive ? currentTime : bestInFive;
            worstInFive = currentTime > worstInFive ? currentTime : worstInFive;
        } else {
            dnfCounter++;
        }
    }

    if (dnfCounter) {
        worstInFive = -1;
    }
    currentSum -= bestInFive;
    currentSum -= worstInFive;

    if (dnfCounter < 2) {
        return currentSum / 3;
    } else {
        return -1;
    }

}

function findAvg() {
    var dnfCounter = 0;
    
    if (timesArray.length) {
        var sum = 0;

        timesArray.forEach(function (currentTime) {
            if (currentTime != -1) {
                sum += currentTime;
            } else {
                dnfCounter++;
            }
        });

        return sum / (timesArray.length - dnfCounter);
    } else {
        return undefined;
    }

}

function deleteTimeFromArray(index) {
    timesArray.splice(index, 1);
}

function addTimeToArray(time) {
    timesArray.push(time);
}

function updateLastTime(time) {
    deleteTimeFromArray(timesArray.length - 1);
    addTimeToArray(time);
}

function getLastTime() {
    return timesArray[timesArray.length - 1];
}

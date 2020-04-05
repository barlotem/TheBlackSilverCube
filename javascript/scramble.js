var scramble = "";
var last = "";
var ok = false;

function getScramble() {

    scramble = "";
    
    for (var i = 1; i <= 25; i++) {
        var r = Math.floor((Math.random() * 6) + 1);
        var c = Math.floor(Math.random() * 3);

        if (r == 1 && last != "U"){
            scramble = scramble + "U";
            ok = true;
            last = "U";
        } else {
            if (r == 2 && last != "D") {
                scramble = scramble + "D";
                ok = true;
                last = "D";
            } else {
                if (r == 3 && last != "R") {
                    scramble = scramble + "R";
                    ok = true;
                    last = "R";
                } else {
                    if (r == 4 && last != "L") {
                        scramble = scramble + "L";
                        ok = true;
                        last = "L";
                    } else {
                        if (r == 5 && last != "F") {
                            scramble = scramble + "F";
                            ok = true;
                            last = "F";
                        } else {
                            if (r == 6 && last != "B") {
                                scramble = scramble + "B";
                                ok = true;
                                last = "B";
                            } else
                                i--;
                        }
                    }
                }
            }
        }
        if (ok == true) {
            if (c == 0)
                scramble = scramble + " ";
            if (c == 1)
                scramble = scramble + "' ";
            if (c == 2)
                scramble = scramble + "2 ";
            ok = false;
        }
    }

    return scramble;
    
}

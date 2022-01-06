function hoursToMilliseconds(time) {
    return timeToMins(time) * 3600 * 1000;
}

// three functions below taken from https://stackoverflow.com/a/25765236/13522077

// Convert a time in hh:mm format to minutes
function timeToMins(time) {
    var b = time.split(':');
    return b[0] * 60 + +b[1];
}

// Convert minutes to a time in format hh:mm
// Returned value is in range 00  to 24 hrs
function timeFromMins(mins) {
    function z(n) { return (n < 10 ? '0' : '') + n; }
    var h = (mins / 60 | 0) % 24;
    var m = mins % 60;
    return z(h) + ':' + z(m);
}

// Add two times in hh:mm format
function addTimes(t0, t1) {
    return timeFromMins(timeToMins(t0) + t1);
}

module.exports = { hoursToMilliseconds, timeToMins, timeFromMins, addTimes }
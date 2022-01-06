/**
 * Converts hours in 24h format to milliseconds
 * @param {string} time Hour in 24h format
 * @returns milliseconds representing the hour
 */
function hoursToMilliseconds(time) {
    return timeToMins(time) * 3600 * 1000;
}

// three functions below taken from https://stackoverflow.com/a/25765236/13522077

/**
 * Convert a time in hh:mm format to minutes
 * @param {string} time time in hh:mm
 * @returns time in minutes
 */
function timeToMins(time) {
    var b = time.split(':');
    return b[0] * 60 + +b[1];
}

// 
// 
/**
 * Convert minutes to a time in format hh:mm
 * @param {number} mins minutes to be converted into hours
 * @returns Returned value is in range 00  to 24 hrs
 */
function timeFromMins(mins) {
    function z(n) { return (n < 10 ? '0' : '') + n; }
    var h = (mins / 60 | 0) % 24;
    var m = mins % 60;
    return z(h) + ':' + z(m);
}

/**
 * Add minutes to a time saved in hours
 * @param {string} hour time in hh:mm
 * @param {*} duration minutes to be added to the hour
 * @returns Returned value is in range 00  to 24 hrs
 */
function addTimes(hour, duration) {
    return timeFromMins(timeToMins(hour) + duration);
}

module.exports = { hoursToMilliseconds, timeToMins, timeFromMins, addTimes }
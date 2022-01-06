const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

require("dotenv").config();
const token = process.env.CLIENT_TOKEN;

// When the client is ready, run this code (only once)
client.once('ready', () => {
    online();
});

client.login(token);

function online() {
    console.log('online');
    fetchSchedule();
}

function fetchSchedule() {
    const schedule = require("./json_files/scheduleSect2.json");
    const today = new Date();
    let dayOfWeek = today.getDay();
    // For sunday and saturday, fetch the schedule for monday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayOfWeek = 1; // set today to monday
    }
    let lastClassOfDay = schedule[dayOfWeek][schedule[dayOfWeek].length - 1];
    // if the last class of today finished before the current time, change the dayOfTheWeek to tomorrow
    if (hoursToMilliseconds(addTimes(lastClassOfDay.time, lastClassOfDay.duration)) <= today.getTime()) {
        dayOfWeek++;
    }
}

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

const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

require("dotenv").config();
const token = process.env.CLIENT_TOKEN;

// When the client is ready, run this code (only once)
client.once('ready', () => {
    online();
});

client.login(token);

/**
 * Called as soon as the bot connects to the discord server
 */
function online() {
    console.log('online');
    fetchSchedule();
}

/**
 * Fetches the json schedule and passes the data along.
 */
function fetchSchedule() {
    const schedule = require("./json_files/scheduleSect2.json");
    determineNextClass(schedule);
    //setClass(lastClassOfDay);
}

/**
 * Determines which class is next in the schedule
 * @param {JSON} schedule JSON schedule data
 * @returns The next class in JSON format
 */
function determineNextClass(schedule) {
    const today = new Date();
    let dayOfWeek = today.getDay();
    let time = today.getTime();
    // default is first course of day
    let course = 0;

    // For sunday and saturday, fetch the schedule for monday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        dayOfWeek = 1; // set today to monday
    } else {
        // for each class there is in the schedule today
        schedule[dayOfWeek].forEach((course) => {
            // If the current class finished in 45 minutes or later, go to the next class
            if (time >= hoursToMilliseconds(addTimes(course.time, course.duration)) - hoursToMilliseconds("00:45")) {
                course++;
            }
            // if we reached the final class today, switch to the first class tomorrow
            if (course === schedule[dayOfWeek].length - 1) {
                course = 0;
                dayOfWeek++;
            }
        });
    }
    let nextClass = schedule[dayOfWeek][course];
    return nextClass;
}

function setClass(course) {
    client.user.setUsername(course.name);
    client.user.setActivity(course.classroom);
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

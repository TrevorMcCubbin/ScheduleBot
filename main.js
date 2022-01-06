const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

require("dotenv").config();
const token = process.env.CLIENT_TOKEN;

const timeCalcs = require("./timeFunctions.js")

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
    let currentClass = determineNextClass(schedule);
    setClass(currentClass);
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
            if (time >= timeCalcs.hoursToMilliseconds(timeCalcs.addTimes(course.time, course.duration)) - timeCalcs.hoursToMilliseconds("00:45")) {
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

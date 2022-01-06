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
    let dayOfWeek = today.getDay() - 1; // -1 so that it works with the json array I set up (monday is 0 instead of 1 in the array)
    let time = today.getHours() + ":" + today.getMinutes();
    // default is first course of day
    let course = 0;

    // For sunday and saturday, fetch the schedule for monday
    if (dayOfWeek >= 5) {
        dayOfWeek = 0; // set today to monday
    } else {
        while (course < schedule[dayOfWeek].length - 1) {
            let current = schedule[dayOfWeek][course];
            // If the current class finished in 45 minutes or later, go to the next class
            if (timeCalcs.timeToMins(time) >= timeCalcs.timeToMins(timeCalcs.addTimes(current.time, current.duration)) - 45) {
                course++;
                continue;
            }
            // if we reached the final class today, switch to the first class tomorrow
            if (course === schedule[dayOfWeek].length && dayOfWeek < 5) {
                course = 0;
                dayOfWeek++;
                break;
            } else if (dayOfWeek === 4) { // if it's friday, set next day to monday
                course = 0;
                dayOfWeek = 0;
                break;
            }
        }
        // for each class there is in the schedule today
        schedule[dayOfWeek].forEach((course) => {

        });
    }
    let nextClass = schedule[dayOfWeek][course];
    console.log(nextClass);
    return nextClass;
}

function setClass(course) {
    client.user.setUsername(course.name);
    client.user.setActivity(course.classroom + ": " + course.time + "-" + timeCalcs.addTimes(course.time, course.duration));
}

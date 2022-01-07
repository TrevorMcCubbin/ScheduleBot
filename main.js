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
    setInterval(function () {
        fetchSchedule()
    }, 1000 * 60 * 5); // every 5 minutes
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
    let dayOfWeek = today.getDay() - 1 >= 0 ? today.getDay() - 1 : 0; // -1 so that it works with the json array I set up (monday is 0 instead of 1 in the array)
    let time = today.getHours() + ":" + today.getMinutes();
    // if semester hasn't started yet, show first class on jan 20th
    if (today.getDate() < 20 && today.getMonth() === 0) {
        let nextClass = schedule[3][0]; // first class on thursday
        console.log(nextClass);
        return nextClass;
    }
    // default is first course of day
    let course = 0;

    // For sunday and saturday, fetch the schedule for monday
    if (dayOfWeek >= 5) {
        dayOfWeek = 0; // set today to monday
    } else {
        while (course < schedule[dayOfWeek].length) {
            let current = schedule[dayOfWeek][course];
            // If the current class finished in 45 minutes or later, go to the next class
            if (timeCalcs.timeToMins(time) >= timeCalcs.timeToMins(timeCalcs.addTimes(current.time, current.duration)) - 45) {
                course++;
            }
            // if we reached the final class today, switch to the first class tomorrow
            if (course === schedule[dayOfWeek].length && dayOfWeek < 5) {
                course = 0; // first class of day
                if (dayOfWeek === 4) { // If it's friday
                    dayOfWeek = 0; // set day to monday
                } else {
                    dayOfWeek++; // otherwise just go to the next day of the week
                }
                break;
            }
        }
    }
    let nextClass = schedule[dayOfWeek][course];
    console.log(nextClass);
    return nextClass;
}

/**
 * Set's the bots username and activity to the next class
 * @param {JSON} course The class object that will be set as the status
 */
function setClass(course) {
    client.user.setUsername(course.name);
    client.user.setActivity(course.classroom + ": " + course.time + "-" + timeCalcs.addTimes(course.time, course.duration));
}

const Discord = require("discord.js");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

require("dotenv").config();
const token = process.env.CLIENT_TOKEN;

const { timeToMins, addTimes } = require("./timeFunctions.js")

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
    try {
        let today = new Date();
        let currentClass = determineNextClass(today);
        let holiday = checkHoliday(today);
        setClass(holiday, currentClass);
    } catch (error) {
        console.error(error);
    }

}

/**
 * Determines which class is next in the schedule
 * @param {Date} today the date you want to get the next class for
 * @returns The next class in JSON format
 */
function determineNextClass(today) {
    console.log("Fetching next class");

    const schedule = require("./json_files/scheduleSect2.json");
    let dayOfWeek = today.getDay() - 1 >= 0 ? today.getDay() - 1 : 0; // -1 so that it works with the json array I set up (monday is 0 instead of 1 in the array)

    // default is first course of day
    let course = 0;

    // For sunday and saturday, fetch the schedule for monday
    if (dayOfWeek >= 5) {
        dayOfWeek = 0; // set today to monday
    } else {
        let time = today.getHours() + ":" + today.getMinutes();
        let i = 0;
        while (i < schedule[dayOfWeek].length - 1) {
            let current = schedule[dayOfWeek][course];
            // If the current class finished in 45 minutes or later, go to the next class
            if (timeToMins(time) >= timeToMins(addTimes(current.time, current.duration)) - 45) {
                course++;
            }
            i++;
        }
        // if we reached the final class today, switch to the first class tomorrow
        if (course === schedule[dayOfWeek].length - 1 && dayOfWeek < 5 ||
            course === 1 && schedule[dayOfWeek].length === 1 && dayOfWeek < 5) {
            course = 0; // first class of day
            if (dayOfWeek === 4) { // If it's friday
                dayOfWeek = 0; // set day to monday
            } else {
                dayOfWeek++; // otherwise just go to the next day of the week
            }
        }
    }
    let nextClass = schedule[dayOfWeek][course];
    return nextClass;
}

/**
 * Set's the bots username and activity to the next class
 * @param {JSON} course The class object that will be set as the status
 */
function setClass(holiday, course) {
    username = course.name;
    activity = course.classroom + ": " + course.time + "-" + addTimes(course.time, course.duration)
    if (holiday && holiday.name.toString() !== "Online") {
        username = holiday.name;
        activity = "Until - " + holiday.end;
    } else if (holiday && holiday.name.toString() === "Online") {
        activity = holiday.name + ": " + course.time + "-" + addTimes(course.time, course.duration);
    }
    if (username != client.user.username) {
        client.user.setUsername(username)
            .catch(() => {
                console.log("Could not change username");
            })
    }
    console.log(username)
    client.user.setActivity(activity);
    showLog(holiday, course);
}

/**
 * checks if the requested date is found in the holdiays json
 * @param {Date} today 
 */
function checkHoliday(today) {
    console.log("Fetching holidays");

    const holidays = require("./json_files/holidays.json");
    const holidaysThisMonth = holidays[today.getMonth()];
    if (holidaysThisMonth.length > 0) { // if there is a holiday this month
        for (let i = 0; i < holidaysThisMonth.length; i++) { // for each holiday
            if (today.getDate() >= new Date(holidaysThisMonth[i].start).getDate() &&
                today.getDate() <= new Date(holidaysThisMonth[i].end).getDate()) {
                return holidaysThisMonth[i];
            }
        }
    }
}

/**
 * Logs the current data when it is applied to the discord bot
 * @param {JSON} holiday holiday JSON
 * @param {JSON} course course json
 */
function showLog(holiday, course) {
    const today = new Date();
    console.log("\n---------------------------------------------------------------------")
    console.log(today.toString() + "\n");
    console.log("Current holiday:\n" + JSON.stringify(holiday) + "\n");
    console.log("Current Class:\n" + JSON.stringify(course));
    console.log("\n---------------------------------------------------------------------")
}

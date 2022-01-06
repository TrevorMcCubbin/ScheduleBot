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
    const week = require("./json_files/scheduleSect2.json");
    const today = new Date().getDay();
    // For sunday and saturday, fetch the schedule for monday
    if (today === 0 || today === 6) {
        today = 1; // set today to monday
    }
    console.log(week[today]);
}

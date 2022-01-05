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
}

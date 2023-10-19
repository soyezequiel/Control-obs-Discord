const DiscordBot = require('./src/modules/discordBot');
const commands = require('./src/modules/commands');
const axios = require('axios');
require('dotenv').config();
const discordBot = new DiscordBot(process.env.DISCORD_TOKEN,commands);
//console.log(commands);
discordBot.initialize();
console.log('Bot inicializado');
discordBot.handleInteractionCreate();


// ... (cualquier otra lógica que necesites en tu archivo principal)


















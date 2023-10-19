const DiscordBot = require('./src/modules/discordBot');
const commands = require('./src/modules/commands');
const axios = require('axios');
require('dotenv').config();
const discordBot = new DiscordBot(process.env.DISCORD_TOKEN);
discordBot.initialize(commands);
console.log('Bot inicializado');

// ... (cualquier otra lógica que necesites en tu archivo principal)


















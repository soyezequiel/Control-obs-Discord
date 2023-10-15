require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OBSWebSocket = require('obs-websocket-js');

//const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: ['CHANNEL'] });
//const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent], partials: ['CHANNEL'] });
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,  // Add this line
        GatewayIntentBits.GuildVoiceStates
    ]
});

const obs = new OBSWebSocket();

// Tu token de bot de Discord
const token = process.env.DISCORD_TOKEN;


// Conectar a OBS WebSocket

// Función para intentar conectar a OBS WebSocket
async function connectToObs() {
    try {
        await obs.connect({ address: 'localhost:4444' });
        console.log('Conectado a OBS');
    } catch (err) {
        console.error('No se pudo conectar a OBS:', err);
        // Esperar 5 segundos antes de intentar nuevamente
        setTimeout(connectToObs, 5000);
    }
}

// Intentar conectar a OBS WebSocket
connectToObs();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});






client.on('messageCreate', async message => {
    // No respondas a otros bots o a ti mismo
    if(message.author.bot) return;

    // Obtén el miembro que envió el mensaje
    const member = message.member;

    // Verifica si el miembro tiene el rol "Streamer"
    if (!member.roles.cache.some(role => role.name === 'Streamer')) {
      //  message.channel.send('No tienes permiso para usar este comando.');
        return;
    }

    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();




    console.log(`Command: ${command}`);  // Log de comando

    if(command === '!startstream') {
        console.log('Attempting to start stream');  // Log antes de intentar iniciar la transmisión
        try {
            await obs.send('StartStreaming');
            message.channel.send('Transmisión iniciada');
        } catch (error) {
            console.error('Error while starting stream:', error);  // Log de error
            message.channel.send('Error al iniciar la transmisión');
        }
    }

    if(command === '!stopstream') {
        console.log('Attempting to stop stream');  // Log antes de intentar detener la transmisión
        try {
            await obs.send('StopStreaming');
            message.channel.send('Transmisión detenida');
        } catch (error) {
            console.error('Error while stopping stream:', error);  // Log de error
            message.channel.send('Error al detener la transmisión');
        }
    }
    if(command === '!changescene') {
        const sceneName = args.join(' ');  // Combina los argumentos restantes en una cadena
        if (!sceneName) {
            message.channel.send('Debes proporcionar el nombre de la escena.');
            return;
        }
        try {
            await obs.send('SetCurrentScene', { 'scene-name': sceneName });
            message.channel.send(`Escena cambiada a: ${sceneName}`);
        } catch (error) {
            console.error(error);
            message.channel.send('Error al cambiar la escena, asegúrate de que el nombre de la escena es correcto.');
        }
    }
});


client.login(token);
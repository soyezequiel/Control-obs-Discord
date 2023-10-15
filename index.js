// Importa las librerías necesarias
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const OBSWebSocket = require('obs-websocket-js');

// Configura las intenciones y parciales del cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Crea una nueva instancia de OBSWebSocket
const obs = new OBSWebSocket();

// Almacena el token del bot de Discord desde un archivo .env
const token = process.env.DISCORD_TOKEN;

// Función para intentar conectar a OBS WebSocket
async function connectToObs() {
    try {
        // Intenta conectar al servidor OBS WebSocket
        await obs.connect({ address: 'localhost:4444' });
        console.log('Conectado a OBS');
    } catch (err) {
        // En caso de error, muestra el error y reintenta en 5 segundos
        console.error('No se pudo conectar a OBS:', err);
        setTimeout(connectToObs, 5000);
    }
}

// Intenta conectar a OBS WebSocket cuando inicia el script
connectToObs();

// Evento que se dispara una vez que el bot está listo
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Evento que se dispara cada vez que se crea un mensaje en un canal del servidor
client.on('messageCreate', async message => {
    // Ignora mensajes de otros bots o del propio bot
    if(message.author.bot) return;

    // Obtiene el miembro que envió el mensaje
    const member = message.member;

    // Verifica si el miembro tiene el rol "Streamer"
    if (!member.roles.cache.some(role => role.name === 'Streamer')) {
        return;
    }

    // Separa el mensaje en comandos y argumentos
    const args = message.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Log del comando recibido
    console.log(`Command: ${command}`);

    // Comandos específicos para controlar OBS
    if(command === '!startstream') {
        // Intenta iniciar la transmisión
        try {
            await obs.send('StartStreaming');
            message.channel.send('Transmisión iniciada');
        } catch (error) {
            console.error('Error al iniciar la transmisión:', error);
            message.channel.send('Error al iniciar la transmisión');
        }
    }

    if(command === '!stopstream') {
        // Intenta detener la transmisión
        try {
            await obs.send('StopStreaming');
            message.channel.send('Transmisión detenida');
        } catch (error) {
            console.error('Error al detener la transmisión:', error);
            message.channel.send('Error al detener la transmisión');
        }
    }

    if(command === '!changescene') {
        // Cambia la escena en OBS
        const sceneName = args.join(' ');
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

// Inicia el bot de Discord
client.login(token);

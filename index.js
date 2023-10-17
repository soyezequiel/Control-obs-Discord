const axios = require('axios');

async function getVideoTitle(videoUrl) {
  const videoId = videoUrl.split('v=')[1];
  const apiKey = process.env.youtube;
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

  try {
    const response = await axios.get(url);
    const title = response.data.items[0].snippet.title;
    return title;
  } catch (error) {
    console.error('Error fetching video title:', error);
  }
}




const updateStreamTitle = require('./funciones');



// Importa las librerías necesarias
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const OBSWebSocket = require('obs-websocket-js');


// Crea una nueva instancia del cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});
// Crea una nueva instancia de OBS WebSocket
const obs = new OBSWebSocket();
// Obtiene el token de Discord desde las variables de entorno
const token = process.env.DISCORD_TOKEN;
// Función para conectar con OBS
async function connectToObs() {
  try {
    await obs.connect({ address: 'localhost:4444' });
    console.log('Conectado a OBS');
  } catch (err) {
    console.error('No se pudo conectar a OBS:', err);
    setTimeout(connectToObs, 5000);
  }
}
// Llama a la función para conectarse a OBS
connectToObs();


// Evento que se dispara cuando el bot está listo
const registerCommands = require('./setupCommands.js');
client.once('ready', async () => {
  await registerCommands(client, token);
});







// Evento que se dispara cuando se crea una interacción (ejemplo: un usuario utiliza un comando de barra inclinada)
client.on('interactionCreate', async interaction => {
  // Verifica si la interacción es un comando
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  // Comando para iniciar la transmisión en OBS
  if (commandName === 'startstream') {
    try {
      await obs.send('StartStreaming');
      await interaction.reply('Transmisión iniciada');
    } catch (error) {
      console.error('Error al iniciar la transmisión:', error);
      await interaction.reply('Error al iniciar la transmisión');
    }
  }
  // Comando para detener la transmisión en OBS
  if (commandName === 'stopstream') {
    try {
      await obs.send('StopStreaming');
      await interaction.reply('Transmisión detenida');
    } catch (error) {
      console.error('Error al detener la transmisión:', error);
      await interaction.reply('Error al detener la transmisión');
    }
  }
  // Comando para cambiar la escena en OBS
  if (commandName === 'changescene') {
    const sceneName = interaction.options.getString('scene');
    try {
      await obs.send('SetCurrentScene', { 'scene-name': sceneName });
      await interaction.reply(`Escena cambiada a: ${sceneName}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Error al cambiar la escena, asegúrate de que el nombre de la escena es correcto.');
    }
  }
  // Comando para ajustar el volumen de "w2g nav"
  if (interaction.commandName === 'setvolume') {
    const volume = interaction.options.getInteger('volume');
    console.log(`Volume received from Discord: ${volume}`);  // Log the received volume

    // Ensure the volume is within the allowed range
    if (volume < 0 || volume > 100) {
      await interaction.reply('El volumen debe estar entre 0 y 100.');
      return;
    }

    const volumeScaled = volume / 100.0;  // Scale the volume to a 0.0 - 1.0 range
    console.log(`Volume scaled for OBS: ${volumeScaled}`);  // Log the scaled volume

    try {
      await obs.send('SetVolume', {
        source: 'musica',  // Updated source name
        volume: volumeScaled,
        useDecibel: false  // This will use a 0.0 to 1.0 scale for volume
      });
      await interaction.reply(`Volumen ajustado a: ${volume}%`);
    } catch (error) {
      console.error('Error setting volume:', error);  // Log any errors
      await interaction.reply('Error al ajustar el volumen.');
    }
  }

  if (interaction.commandName === 'showdiscord') {
    try {
      await obs.send('SetSceneItemProperties', {
        item: 'discord',  // Nombre de la fuente
        visible: true  // Mostrar la fuente
      });
      await interaction.reply('Ventana de Discord mostrada.');
    } catch (error) {
      console.error('Error al mostrar la ventana de Discord:', error);
      await interaction.reply('Error al mostrar la ventana de Discord.');
    }
  }

  if (interaction.commandName === 'hidediscord') {
    try {
      await obs.send('SetSceneItemProperties', {
        item: 'discord',  // Nombre de la fuente
        visible: false  // Ocultar la fuente
      });
      await interaction.reply('Ventana de Discord ocultada.');
    } catch (error) {
      console.error('Error al ocultar la ventana de Discord:', error);
      await interaction.reply('Error al ocultar la ventana de Discord.');
    }
  }

  // Comando para ajustar el volumen del canal de voz
  if (commandName === 'setvoicevolume') {
    const volumePercentage = interaction.options.getNumber('volume') / 100;  // Convierte el porcentaje a un valor entre 0 y 1
    try {
      await obs.send('SetVolume', {
        source: 'voz',  // Asegúrate de que 'voz' sea el nombre exacto del canal de audio en OBS
        volume: volumePercentage
      });
      await interaction.reply(`Volumen del canal de voz ajustado a: ${interaction.options.getNumber('volume')}%`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Error al ajustar el volumen del canal de voz.');
    }
  }
  // Comando para obtener el enlace para cambiar la música
  if (commandName === 'cambiarmusica') {
    try {
      await interaction.reply('https://w2g.tv/?r=8px5xf4ugi12muzkxe');
    } catch (error) {
      console.error(error);
      await interaction.reply('Error al obtener el enlace para cambiar la música.');
    }
  }
  // ... tus otros manejadores de comandos
  if (interaction.commandName === 'settitle') {
    const newTitle = interaction.options.getString('title');
    await updateStreamTitle(newTitle);
    await interaction.reply(`Título del stream cambiado a: ${newTitle}`);
  }
  // devuelve los links con las plataformas de donde se trasmite
  if (interaction.commandName === 'verstream') {
    const link1 = 'https://www.twitch.tv/lacryptatv';
    const link2 = 'https://zap.stream/p/npub19vqjdaudm3vk4gavgpygkxtn3pc07kxvlmj3jww6h8wvwr242uqq0dekq0';
    await interaction.reply(`Puedes ver los stream en: \n 🔴 Twitch: ${link1} \n 🔴 Zap.stream: ${link2}`);
  }
  // ... tus otros manejadores de comandos
  if (interaction.commandName === 'addsong') {
    const url = interaction.options.getString('url');
    const title = await getVideoTitle(url);
    try {
    //  const response = await fetch("https://api.w2g.tv/rooms/kx9mc4jozawf3ayenbo4fx/playlists/current/playlist_items/sync_update", {
      const response = await fetch("https://api.w2g.tv/rooms/8px5xf4ugi12muzkxe/playlists/current/playlist_items/sync_update", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "w2g_api_key": process.env.w2g,
          "add_items": [{ "url": url, "title": title }]
        })
      });
      await interaction.reply(`Canción agregada: ${title}`);
    } catch (error) {
      console.error('Error al agregar la canción:', error);
      await interaction.reply('Error al agregar la canción.');
    }
  }
});



// Conecta el bot a Discord usando el token
client.login(token);
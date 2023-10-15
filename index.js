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
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Registra los Slash Commands con la API de Discord
  const commands = [
    {
      name: 'startstream',
      description: 'Inicia la transmisión en OBS'
    },
    {
      name: 'stopstream',
      description: 'Detiene la transmisión en OBS'
    },
    {
      name: 'changescene',
      description: 'Cambia la escena en OBS',
      options: [
        {
          name: 'scene',
          type: 3,  // Usamos 3 en lugar de 'STRING'
          description: 'Nombre de la escena',
          required: true
        }
      ]
    }
    ,{
      name: 'setvolume',
      description: 'Ajusta el volumen de la fuente "w2g nav"',
      options: [
        {
          name: 'volume',
          type: 4,  // Tipo INTEGER
          description: 'Valor del volumen (0 a 100)',
          required: true
        }
      ]
    }
  ];
  // Crea una nueva instancia REST para hacer peticiones a la API de Discord
  const rest = new REST({ version: '9' }).setToken(token);
  try {
    console.log('Actualizando comandos de barra inclinada (/)...');
    // Actualiza los comandos de barra inclinada en el servidor de Discord
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, '470689796239392768'),
      { body: commands }
    );

    console.log('Comandos de barra inclinada (/) registrados.');
  } catch (error) {
    console.error(error);
  }
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

});



// Conecta el bot a Discord usando el token
client.login(token);




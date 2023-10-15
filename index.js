// Importa las librerías necesarias
require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const OBSWebSocket = require('obs-websocket-js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const obs = new OBSWebSocket();
const token = process.env.DISCORD_TOKEN;

async function connectToObs() {
    try {
        await obs.connect({ address: 'localhost:4444' });
        console.log('Conectado a OBS');
    } catch (err) {
        console.error('No se pudo conectar a OBS:', err);
        setTimeout(connectToObs, 5000);
    }
}

connectToObs();

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
  ];

  const rest = new REST({ version: '9' }).setToken(token);
  try {
    console.log('Actualizando comandos de barra inclinada (/)...');

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, '470689796239392768'),
      { body: commands }
    );

    console.log('Comandos de barra inclinada (/) registrados.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'startstream') {
    try {
      await obs.send('StartStreaming');
      await interaction.reply('Transmisión iniciada');
    } catch (error) {
      console.error('Error al iniciar la transmisión:', error);
      await interaction.reply('Error al iniciar la transmisión');
    }
  }

  if (commandName === 'stopstream') {
    try {
      await obs.send('StopStreaming');
      await interaction.reply('Transmisión detenida');
    } catch (error) {
      console.error('Error al detener la transmisión:', error);
      await interaction.reply('Error al detener la transmisión');
    }
  }

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
});

client.login(token);

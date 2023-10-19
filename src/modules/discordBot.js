const { Client, GatewayIntentBits } = require('discord.js');
const { REST, Routes } = require('discord.js');
const ObsManager = require('./obsManager');


class DiscordBot {
    constructor(token) {
        console.log('Constructor ejecutado');
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates
            ]
        });
        this.token = token;
        this.client.login(this.token);
        this.obsManager = new ObsManager();  // Crear una instancia de ObsManager
    }
    async #getVideoTitle(videoUrl) {
        const videoId = videoUrl.split('v=')[1];
        const apiKey = process.env.youtube;
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;
      
        try {
          const response = await axios.get(url);
          const title = response.data.items[0].snippet.title;
          return title;
        } catch (error) {
          console.error('Error fetching video title:', error);
          return null;  // Agregar esta línea
        }
      }
    async handleReady() {
        console.log('handleReady ejecutado');
        this.client.once('ready', async () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
            await this.registerCommands();
            // ... (cualquier otra lógica que desees ejecutar cuando el bot esté listo)
        });
    }

    async handleInteractionCreate() {
        console.log('registerCommands ejecutado');
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            const { commandName } = interaction;
            // ... (código para manejar diferentes comandos)
            // devuelve los links con las plataformas de donde se trasmite
            if (interaction.commandName === 'verstream') {
                const link1 = 'https://www.twitch.tv/lacryptatv';
                const link2 = 'https://zap.stream/p/npub19vqjdaudm3vk4gavgpygkxtn3pc07kxvlmj3jww6h8wvwr242uqq0dekq0';
                await interaction.reply(`Puedes ver los stream en: \n 🔴 Twitch: ${link1} \n 🔴 Zap.stream: ${link2}`);
            }
            // agrega musica
            if (interaction.commandName === 'addsong') {
                const url = interaction.options.getString('url');
                const title = await this.#getVideoTitle(url);
                try {
                    await this.obsManager.addsong(url, title)
                } catch (error) {
                    await interaction.reply('Error al agregar la canción.');
                }
            }
            if (commandName === 'cambiarmusica') {
                try {
                    await interaction.reply('https://w2g.tv/?r=8px5xf4ugi12muzkxe');
                } catch (error) {
                    console.error(error);
                    await interaction.reply('Error al obtener el enlace para cambiar la música.');
                }
            }
            // Comando para iniciar la transmisión en OBS
            if (commandName === 'startstream') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }
                try {
                    await this.obsManager.startStreaming();
                } catch (error) {
                    await interaction.reply('Error al iniciar la transmisión');
                }
            }
            // Comando para detener la transmisión en OBS
            if (commandName === 'stopstream') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }
                try {
                    await this.obsManager.stopStream();
                } catch (error) {
                    await interaction.reply('Error al detener la transmisión');
                }

                
            }
            // Comando para cambiar la escena en OBS
            if (commandName === 'changescene') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }
                
                const sceneName = interaction.options.getString('scene');
                try {
                    await this.obsManager.changeScene(sceneName);
                } catch (error) {
                    await interaction.reply('Error al cambiar la escena, asegúrate de que el nombre de la escena es correcto.');
                }
                

            }
            // Comando para ajustar el volumen de "w2g nav"
            if (interaction.commandName === 'setvolume') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }

                const volume = interaction.options.getInteger('volume');
                console.log(`Volume received from Discord: ${volume}`);  // Log the received volume

                const volumeScaled = volume / 100.0;  // Scale the volume to a 0.0 - 1.0 range
                console.log(`Volume scaled for OBS: ${volumeScaled}`);  // Log the scaled volume
                try {
                    await this.obsManager.setVolume(volume);
                } catch (error) {
                    await interaction.reply('Error al ajustar el volumen.');
                }
                

            }

            if (interaction.commandName === 'showdiscord') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }
                try {
                    await this.obsManager.showDiscord();
                } catch (error) {
                    await interaction.reply('Error al mostrar la ventana de Discord.');

                }
                
            }

            if (interaction.commandName === 'hidediscord') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }

                try {
                    await this.obsManager.hideDiscord();
                } catch (error) {
                    await interaction.reply('Error al ocultar la ventana de Discord.');
                }
                

            }

            // Comando para ajustar el volumen del canal de voz
            if (commandName === 'setvoicevolume') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }

                const volumePercentage = interaction.options.getNumber('volume') / 100;  // Convierte el porcentaje a un valor entre 0 y 1
                try {
                    await this.obsManager.setVoiceVolume(volume);
                } catch (error) {
                    await interaction.reply('Error al ajustar el volumen del canal de voz.');

                }
                
            }
            // Establecer titulo del stream de twitch
            if (interaction.commandName === 'settitle') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }
                try {
                    await this.obsManager.setTitle(newTitle);
                } catch (error) {
                    await interaction.reply(`Título del stream cambiado a: ${newTitle}`);
                }
                
            }
            if (commandName === 'refreshbrowser') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }

                try {
                    await this.obsManager.refreshBrowser();
                } catch (error) {
                    await interaction.reply('Error al actualizar la página del navegador.');
                }
                
            }
            if (commandName === 'startpuerta') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }

                try {
                    await this.obsManager.changeScene(sceneName);
                } catch (error) {
                    await interaction.reply('Error al ejecutar la secuencia startPuerta.');
                }
                
            }
            if (commandName === 'stoppuerta') {
                if (!interaction.member.roles.cache.has(process.env.rol)) {
                    await interaction.reply('No tienes los permisos necesarios para usar este comando.');
                    return;
                }
                try {
                    await this.obsManager.stopPuerta();
                } catch (error) {
                    await interaction.reply('Error al ejecutar la secuencia stopPuerta.');
                }
                
            }
        });
    }
    // ... (otros métodos para manejar comandos, eventos, etc.)

    async registerCommands(commands) {
        const rest = new REST({ version: '9' }).setToken(this.token);
        try {
          console.log('Actualizando comandos de barra inclinada (/)...');
          await rest.put(
            Routes.applicationCommands(this.client.user.id),
            { body: commands }
          );
          console.log('Comandos de barra inclinada (/) registrados.');
        } catch (error) {
          console.error(error);
        }
      }

      async initialize(commands) {
        console.log('initialize ejecutado');
        await this.client.login(this.token);
        await this.registerCommands(commands);
        // ... (cualquier otra lógica de inicialización)
      }


}

module.exports = DiscordBot;

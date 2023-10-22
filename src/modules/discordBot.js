//const { Client, GatewayIntentBits } = require('discord.js');
//const { REST, Routes } = require('discord.js');
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const axios = require('axios');
const ObsManager = require('./obsManager');



class DiscordBot {
    constructor(token, commands) {
        console.log('Constructor de Discord Bot ejecutado');
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildVoiceStates
            ]
        });
        this.token = token;
        this.client.login(this.token);
        this.obsManager = new ObsManager();  // Crear una instancia de ObsManager
        this.obsManager.connect();
        // Agregar manejador del evento error aquí
        this.client.on('error', error => {
            console.error('Error en el cliente de Discord:', error);
        });
        this.client.on('ready', () => {
            console.log('Discord Bot is ready!');
            this.registerCommands(commands);
        });


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
                    await this.obsManager.addsong(url, title);
                    await interaction.reply(`Canción agregada: ${title}`);

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
                    await interaction.reply('Transmisión iniciada con éxito.');
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
                    await interaction.reply('Transmisión detenida con éxito.');
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
                    await interaction.reply(`Escena cambiada a: ${sceneName}`);
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
                    await interaction.reply(`Volumen ajustado a: ${volume}`);
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
                    await interaction.reply(`Ahora se esta mostrando discord`);
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
                    await interaction.reply(`Discord ocultado`);
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
                    await this.obsManager.setVoiceVolume(volumePercentage);
                    await interaction.reply(`Volumen de voz ajustado a: ${volumePercentage * 100}`);
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
                const newTitle = interaction.options.getString('title');
                try {
                    await this.obsManager.setTitle(newTitle);
                    await interaction.reply(`Ahora el titulo del stream en twitch es ${newTitle}`);
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
                    await interaction.reply(`Navegador actualizado`);

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
                    await this.obsManager.startPuerta();
                    await interaction.reply(`Ejecutada la secuencia Start Puerta`);
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
                    await interaction.reply(`Ejecutada la secuencia Stop Puerta`);

                } catch (error) {
                    await interaction.reply('Error al ejecutar la secuencia stopPuerta.');
                }

            }
            if (commandName === 'mostrarnombre') {
                const nombre = interaction.options.getString('nombre');
                const foto = interaction.options.getString('foto');
                
                try {
                    await this.obsManager.mostrarNombre(nombre, foto);
                    await interaction.reply(`Grupo invitado actualizado: Nombre = ${nombre}, Foto = ${foto}`);
                } catch (error) {
                    await interaction.reply('Error al actualizar el grupo invitado.');
                }
            }
            


        });
    }
    // ... (otros métodos para manejar comandos, eventos, etc.)

    async registerCommands(commands) {
        console.log('++++++++++registrando comandos');
        const rest = new REST({ version: '9' }).setToken(this.token);
        try {
            console.log('Actualizando comandos de barra inclinada (/)...');
            await rest.put(
                Routes.applicationCommands(this.client.user.id),
                { body: commands }
            );
            console.log('Comandos de barra inclinada (/) registrados.');
        } catch (error) {
            console.error('error: register commands', error);
        }
    }

    async initialize(commands) {
        console.log('Inicio de initialize');
        await this.client.login(this.token);
        console.log('Después de login');
        console.log('Estado del cliente de Discord:', this.client.isReady());
        if (this.client.isReady()) {
            console.log('Llamada a registerCommands');

            console.log('Fin de registerCommands');
        } else {
            console.log('El cliente de Discord no está listo');
        }


    }


}


module.exports = DiscordBot;

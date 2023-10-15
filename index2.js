const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,  // Add this line
        GatewayIntentBits.GuildVoiceStates
    ]
});


const player = createAudioPlayer();

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    console.log(`Received message: '${message.content}' from ${message.guild?.name}/${message.channel.name} by ${message.author.username}`);

    if (message.content.startsWith('!play ')) {
        console.log('Play command received'); 
        const url = message.content.split(' ')[1];
        const channel = message.member?.voice?.channel;
      
        if (channel) {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            const stream = ytdl(url, { filter: 'audioonly' });
            const resource = createAudioResource(stream);
  
            player.play(resource);
            connection.subscribe(player);
            console.log("Playing now");
        } else {
            message.reply('Debes estar en un canal de voz para usar este comando.');
        }
    }
});

client.on('error', console.error); 

player.on(AudioPlayerStatus.Idle, () => {
    console.log("The audio player has stopped.");
});

client.login('MTE2MjAwODkwNDcwNDc0MTM3Ng.GIzbew.qcNpcaDNeCDMRaBJ51O3IQlc4Uc0-dHYAogSlw');

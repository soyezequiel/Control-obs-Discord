
const axios = require('axios');
async function updateStreamTitle(newTitle) {
    try {
        const response = await axios.patch(
            'https://api.twitch.tv/helix/channels?broadcaster_id=' + process.env.TWITCH_CHANNEL_ID,
            { title: newTitle },
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    'Authorization': process.env.TWITCH_AUTORIZACION,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 204) {
            console.log('Título del stream actualizado exitosamente');
        } else {
            console.error('Error al actualizar el título del stream:', response.data);
        }
    } catch (error) {
        console.error('Error al actualizar el título del stream:', error.response ? error.response.data : error.message);
    }
}

module.exports = updateStreamTitle;

const OBSWebSocket = require('obs-websocket-js');
const axios = require('axios');
class ObsManager {
    constructor() {
        console.log('Constructor ObsManager ejecutado');
        this.obs = new OBSWebSocket();
        this.propiedades = {
            invitado: null,
            persona1: null,
            persona2: null,
            persona3: null
        }

    }

    async connect() {
        console.log('connect ejecutado');
        try {
            await this.obs.connect({ address: 'localhost:4444' });
            console.log('Conectado a OBS');
        } catch (err) {
            console.error('No se pudo conectar a OBS:', err);
            setTimeout(() => this.connect(), 5000);
        }
    }
    async #updateStreamTitle(newTitle) {
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
    async #startPuertaSequence() {
        try {
            // Refrescar la página del navegador
            await this.obs.send('RefreshBrowserSource', {
                sourceName: 'musica',  // Reemplaza con el nombre de tu fuente de navegador en OBS
            });

            // Cambiar el título del stream
            await this.#updateStreamTitle("La puerta de la crypta");

            // Iniciar la transmisión
            await this.obs.send('StartStreaming');

            // Ajustar el volumen del canal de voz a 0
            await this.obs.send('SetVolume', {
                source: 'voz',  // Asegúrate de que 'voz' sea el nombre exacto del canal de audio en OBS
                volume: 0
            });
            // Ocultar la imagen llamada 'barra'
            await this.obs.send('SetSceneItemProperties', {
                item: 'barra',
                visible: false
            });

            // Ocultar la carpeta llamada 'banner'
            await this.obs.send('SetSceneItemProperties', {
                item: 'banner',
                visible: false
            });

        } catch (error) {
            console.error('Error en la secuencia startPuerta:', error);
        }
    }
    async #stopPuertaSequence() {
        try {
            // Cambiar el título del stream
            await this.#updateStreamTitle("La crypta");

            // Detener la transmisión
            await this.obs.send('StopStreaming');

            // Ajustar el volumen del canal de música a 100%
            await this.obs.send('SetVolume', {
                source: 'musica',  // Asegúrate de que 'musica' sea el nombre exacto del canal de audio en OBS
                volume: 1.0
            });
            // Ocultar la imagen llamada 'barra'
            await this.obs.send('SetSceneItemProperties', {
                item: 'barra',
                visible: true
            });

            // Ocultar la carpeta llamada 'banner'
            await this.obs.send('SetSceneItemProperties', {
                item: 'banner',
                visible: true
            });

        } catch (error) {
            console.error('Error en la secuencia stopPuerta:', error);
        }
    }
    async startStreaming() {
        console.log('startStreaming ejecutado');
        try {
            await this.obs.send('StartStreaming');
            return 'Transmisión iniciada';
        } catch (error) {
            throw new Error('Error al iniciar la transmisión:', error);
        }
    }
    async stopStream() {
        try {
            await this.obs.send('StopStreaming');
            return 'Transmisión detenida';

        } catch (error) {
            throw new Error('Error al detener la transmisión:', error);
        }
    }
    async changeScene(sceneName) {
        try {
            await this.obs.send('SetCurrentScene', { 'scene-name': sceneName });
            return `Escena cambiada a: ${sceneName}`;

        } catch (error) {
            throw new Error('Error al cambiar la escena, asegúrate de que el nombre de la escena es correcto.');
        }
    }
    async setVolume(volume) {
        if (volume < 0 || volume > 100) {
            return 'El volumen debe estar entre 0 y 100.';
        }
        const volumeScaled = volume / 100.0;  // Scale the volume to a 0.0 - 1.0 range
        try {
            await this.obs.send('SetVolume', {
                source: 'musica',  // Updated source name
                volume: volumeScaled,
                useDecibel: false  // This will use a 0.0 to 1.0 scale for volume
            });
            return `Volumen ajustado a: ${volume}%`;

        } catch (error) {
            throw new Error('Error setting volume:', error);
        }
    }
    async showDiscord() {
        try {
            await this.obs.send('SetSceneItemProperties', {
                item: 'discord',  // Nombre de la fuente
                visible: true  // Mostrar la fuente
            });
            return 'Ventana de Discord mostrada.';
        } catch (error) {
            throw new Error('Error al mostrar la ventana de Discord:', error);
        }
    }
    async hideDiscord() {
        try {
            await this.obs.send('SetSceneItemProperties', {
                item: 'discord',  // Nombre de la fuente
                visible: false  // Ocultar la fuente
            });
            return 'Ventana de Discord ocultada.';
        } catch (error) {
            throw new Error('Error al ocultar la ventana de Discord:', error);
        }
    }
    async setVoiceVolume(volume) {
        try {
            await this.obs.send('SetVolume', {
                source: 'voz',  // Asegúrate de que 'voz' sea el nombre exacto del canal de audio en OBS
                volume: volume
            });
            return `Volumen del canal de voz ajustado a: ${volume}`;
        } catch (error) {
            throw new Error('Error al ajustar el volumen del canal de voz.', error);
        }
    }
    async setTitle(newTitle) {
        try {
            await this.#updateStreamTitle(newTitle);
            return `Título del stream cambiado a: ${newTitle}`;
        } catch (error) {
            throw new Error('Error al cambiar el titulo de la transmisión', error);
        }
    }
    async refreshBrowser() {
        try {
            await this.obs.send('RefreshBrowserSource', {
                sourceName: 'musica',  // Reemplaza con el nombre de tu fuente de navegador en OBS
            });
            return 'Página del navegador actualizada.';
        } catch (error) {
            throw new Error('Error al actualizar la página del navegador:', error);
        }
    }
    async startPuerta() {
        try {
            await this.#startPuertaSequence();
            return 'Secuencia startPuerta ejecutada exitosamente.';
        } catch (error) {
            throw new Error('Error al ejecutar la secuencia startPuerta:', error);
        }
    }
    async stopPuerta() {
        try {
            await this.#stopPuertaSequence();
            return 'Secuencia stopPuerta ejecutada exitosamente.';
        } catch (error) {
            throw new Error('Error al ejecutar la secuencia stopPuerta:', error);
        }
    }
    async addsong(url, title) {
        try {
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
            return `Canción agregada: ${title}`;
        } catch (error) {
            throw new Error('Error al agregar la canción:', error);
        }
    }
    async mostrarNombre() {
        try {
            // Ocultar invitado
            await this.obs.send('SetSceneItemProperties', {
                item: 'Invitado',
                visible: true
            });
        } catch (error) {
            throw new Error('Error al actualizar nombre y foto:', error);
        }
    }
    async ocultarNombre() {
        try {
            // Ocultar invitado
            await this.obs.send('SetSceneItemProperties', {
                item: 'Invitado',
                visible: false
            });
        } catch (error) {
            throw new Error('Error al actualizar nombre y foto:', error);
        }
    }
    async asignarNombre(nombre, foto) {
        try {
            // Si los elementos están dentro de un grupo llamado 'invitado',
            // la referencia podría verse algo así (esto es solo un ejemplo y podría no funcionar en todas las configuraciones)
            // const nombreElement = 'invitado/nombre';
            // const fotoElement = 'invitado/foto';
            const nombreElement = 'nombre';
            const fotoElement = 'foto';



            // Cambia el contenido del elemento 'nombre'
            await this.obs.send('SetTextGDIPlusProperties', {
                source: nombreElement,  // actualizado para reflejar la ruta completa
                text: nombre
            });

            // Cambia la URL del navegador 'foto'
            await this.obs.send('SetBrowserSourceProperties', {
                source: fotoElement,  // actualizado para reflejar la ruta completa
                url: foto
            });

            return 'Nombre y foto actualizados exitosamente.';
        } catch (error) {
            throw new Error('Error al actualizar nombre y foto:', error);
        }
    }
    async mostrarEntrada() {
        try {
            // Ocultar invitado
            await this.obs.send('SetSceneItemProperties', {
                item: 'entrada',
                visible: true
            });
            await this.obs.send('SetSceneItemProperties', {
                item: 'musica',
                visible: false
            });
        } catch (error) {
            throw new Error('Error al cambiar los atributos de esos elementos:', error);
        }
    }
    async ocultarEntrada() {
        try {
            // Ocultar invitado
            await this.obs.send('SetSceneItemProperties', {
                item: 'entrada',
                visible: false
            });
            await this.obs.send('SetSceneItemProperties', {
                item: 'musica',
                visible: true
            });
        } catch (error) {
            throw new Error('Error al cambiar los atributos de esos elementos:', error);
        }
    }
    async mostrar(nombre) {
        try {
            // 1. Obtener propiedades actuales
            const currentProperties = await this.obs.send('GetSceneItemProperties', { 'item': nombre });

            this.propiedades.invitado = currentProperties;


            // 2. Calcular nuevas dimensiones (por ejemplo, aumentar en un 50%)
            const newScaleX = currentProperties.scale.x * 1.1;
            const newScaleY = currentProperties.scale.y * 1.1;

            // 3. Calcular la nueva posición para mantener el centro
            const newPosX = currentProperties.position.x - (currentProperties.width * (newScaleX - currentProperties.scale.x) / 2);
            const newPosY = currentProperties.position.y - (currentProperties.height * (newScaleY - currentProperties.scale.y) / 2);

            // 4. Aplicar las nuevas propiedades
            // Para habilitar el filtro de blanco y negro
            await this.obs.send('SetSourceFilterVisibility', {
                'sourceName': nombre,
                'filterName': 'Corrección de color', // Nombre del filtro que añadiste en OBS
                'filterEnabled': false
            });
            await this.obs.send('SetSceneItemProperties', {
                'item': nombre,
                'scale': { 'x': newScaleX, 'y': newScaleY },
                'position': { 'x': newPosX, 'y': newPosY }
            });
            scale_filter: 'disable'  // Filtro de escala, puedes usar "disable", "point", "bilinear", etc.


        } catch (error) {
            throw new Error('Error al cambiar los atributos de esos elementos:', error);
        }
    }
    async ocultar(nombre) {
        try {
            if (this.propiedades.invitado === null) {
                this.propiedades.invitado = await this.obs.send('GetSceneItemProperties', { 'item': nombre });
            }
            await this.obs.send('SetSourceFilterVisibility', {
                'sourceName': nombre,
                'filterName': 'Corrección de color', // Nombre del filtro que añadiste en OBS
                'filterEnabled': true
            });
            //  console.log('Propiedades originales:', this.propiedades.invitado);
            await this.obs.send('SetSceneItemProperties', {
                'item': nombre,
                //        'scale': { filter: 'OBS_SCALE_DISABLE', x: 1.0078125, y: 1.0057142972946167 },
                //       'position': { x: 34, y: 495, alignment: 5 }
                'scale': this.propiedades.invitado.scale,
                'position': this.propiedades.invitado.position
            });
            console.log('Propiedades restauradas.');


        } catch (error) {
            throw new Error('Error al cambiar los atributos de esos elementos:', error);
        }
    }



    // ... (otros métodos para interactuar con OBS)
}

module.exports = ObsManager;
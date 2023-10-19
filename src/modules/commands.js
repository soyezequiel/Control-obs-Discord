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
    , {
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
    , {
        name: 'showdiscord',
        description: 'Muestra la ventana de Discord en OBS'
    },
    {
        name: 'hidediscord',
        description: 'Oculta la ventana de Discord en OBS'
    }
    , {
        name: 'setvoicevolume',
        description: 'Ajusta el volumen del canal de voz',
        options: [
            {
                name: 'volume',
                type: 10,
                description: 'Volumen (0-100%)',
                required: true
            }
        ]
    }
    , {
        name: 'cambiarmusica',
        description: 'Obtén el enlace para cambiar la música'
    }
    , {
        name: 'settitle',
        description: 'Cambia el título del stream en Twitch',
        options: [
            {
                name: 'title',
                type: 3,  // STRING
                description: 'Nuevo título del stream',
                required: true
            }
        ]
    }
    , {
        name: 'verstream',
        description: 'Devuelve los links para ver los streams',
    }
    , {
        name: 'addsong',
        description: 'Agrega una canción a la lista de reproducción de Watch2Gether',
        options: [
            {
                name: 'url',
                type: 3,  // STRING
                description: 'URL de la canción',
                required: true
            }
        ]
    }
    , {
        name: 'refreshbrowser',
        description: 'Refresca la página del navegador incorporado en OBS',
    }
    , {
        name: 'startpuerta',
        description: 'Inicia la transmisión de "La puerta de la crypta"',
    }
    , {
        name: 'stoppuerta',
        description: 'Deshace la secuencia de comandos ejecutada por startpuerta',
    }

];
module.exports = commands;
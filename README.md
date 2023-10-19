Control de obs con Discord

Este proyecto es una solución completa para la transmisión de radio en línea. Es compatible con varias plataformas como Discord, Twitch y YouTube. Este proyecto se desarrolló como parte de "La crypta", una comunidad bitcoiner de Argentina.


Instalación

Antes de comenzar, asegúrate de tener Node.js instalado en tu sistema.

Clona el repositorio:



git clone https://github.com/tu_usuario/nombre_del_proyecto.git

Navega hasta el directorio del proyecto:



cd nombre_del_proyecto

Instala las dependencias:




npm install axios discord.js dotenv obs-websocket-js

Configura las variables de entorno en el archivo .env.


Uso

Para iniciar el programa, ejecuta:





node index.js

Estructura del Proyecto




.
├── src/

│   ├── modules/

│   │   ├── discordBot.js

│   │   ├── obsManager.js

│   │   ├── twitchManager.js

│   │   └── youtubeManager.js

│   └── utils/

│       ├── errorHandler.js

│       └── constants.js

├── index.js

├── config.js

├── .env

└── package.json


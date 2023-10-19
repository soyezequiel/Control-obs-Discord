Control de obs con Discord
Este proyecto es una solución completa para la transmisión de radio en línea. Es compatible con varias plataformas como Discord, Twitch y YouTube. Este proyecto se desarrolló como parte de "La crypta", una comunidad bitcoiner de Argentina.

Tabla de Contenidos
Instalación
Uso
Estructura del Proyecto
Contribuir
Licencia
Instalación
Antes de comenzar, asegúrate de tener Node.js instalado en tu sistema.

Clona el repositorio:

bash
Copy code
git clone https://github.com/tu_usuario/nombre_del_proyecto.git
Navega hasta el directorio del proyecto:

bash
Copy code
cd nombre_del_proyecto
Instala las dependencias:

bash
Copy code
npm install axios discord.js dotenv obs-websocket-js
Configura las variables de entorno en el archivo .env.

Uso
Para iniciar el programa, ejecuta:

bash
Copy code
node index.js
Estructura del Proyecto
lua
Copy code
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

Contribuir
Si deseas contribuir al proyecto, por favor crea un "fork" del repositorio y envía un "pull request".

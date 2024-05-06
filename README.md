# My MusicApp

Aplicacion de prueba para conocer el top canciones en tu país.

## Instalación

1. Clona el repositorio de GitHub en tu máquina local:
```
git clone https://github.com/rojo95/MyMusicApp.git
```

2. Ve al directorio de la aplicación:
```
cd ./MyMusicApp
```

3. Instala las dependencias utilizando npm o yarn:
```
npm install // yarn install
```

## Configuración

Antes de ejecutar la aplicación, asegúrate de configurar las siguientes variables de entorno en un archivo `.env` en el directorio raíz del proyecto:
```
LAST_FM_API_KEY=TU_API_KEY
LAST_FM_API_SECRET_KEY=TU_API_KEY_SECRETA
API_LAST_FM=URL_A_LA_QUE_SE_REALIZARÁN_CONSULTAS
```

## Requisitos
- debes tener [Node.js](https://nodejs.org/en/download/current) instalado

- debes tener instalado NPM (node de windows lo trae instalado)

- debes tener instalado [expo](https://docs.expo.dev/)   


## Ejecución

Una vez que hayas completado la instalación y configuración, puedes ejecutar la aplicación utilizando Expo. Asegúrate de tener Expo instalado en tu máquina.
```
npx expo // npx expo start
```

## Visualizacion de la App
Para ver la app debes tener instalado Expo en tu dispositivo móvil y escanear el QR que suministra expo

En caso de querer visualizarlo en el navegador, debe ejecutar el siquiete comando 
```
npx expo install react-native-web react-dom
```

Luego reiniciar expo y pulsar ```w``` en la consola que esta ejecutando la app para que abra el navegador.

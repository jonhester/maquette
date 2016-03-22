# maquette
Connects Smartthings to an MQTT broker. I'm using this with Home Assistant. Inspired by [smartthings-mqtt-bridge](https://github.com/stjohnjohnson/smartthings-mqtt-bridge). It authenticates with Smartthings via oauth and Smartthings communicates back to Maquette using http basic auth. For this to be secure Maquette needs to run behind SSL. I'm using Caddy to reverse proxy to node. At the moment this is not very easy to setup. It should be able to read any device that Smartthings supports, but currently it only can control switches. 
## Requirements
- an MQTT broker like Mosquitto
- a server with node installed

## Setup
1. Install the [Maquette Smartapp](https://raw.githubusercontent.com/jonhester/maquette/master/src/app.groovy) on [Smartthings](https://graph.api.smartthings.com/ide/apps) and get the oauth client id and secret.
2. Clone this project, `npm install` in the newly created folder
3. Update `config.json`

```bash
./node_modules/.bin/sequelize db:migrate
npm run build
node .
```


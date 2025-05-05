const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const loadMongo = require('./handlers/loadMongo');
const loadCommands = require('./handlers/loadCommands');
const loadEvents = require('./handlers/loadEvents');
const loadStatus = require('./handlers/loadStatus');

// Conectar ao MongoDB
loadMongo();

// Instanciando o client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Preparar comandos
client.commands = new Collection();

// Carregar comandos e eventos
loadCommands(client);
loadEvents(client);
loadStatus(client);

// Login do bot
client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log('🤖 Bot iniciado com sucesso!'))
  .catch((err) => {
    console.error('❌ Erro ao fazer login no Discord:', err);
    process.exit(1);
  });

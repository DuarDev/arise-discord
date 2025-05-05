const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const loadMongo = require('./handlers/loadMongo');
const GuildConfig = require('./models/GuildConfig');

// Coleta os comandos
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    console.log(`✅ Comando carregado: ${command.data.name}`);
  } else {
    console.warn(`⚠️  O comando em "./commands/${file}" está mal estruturado.`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await loadMongo();
    const configs = await GuildConfig.find();

    if (!configs.length) {
      console.warn('⚠️ Nenhum servidor encontrado no banco.');
      return;
    }

    console.log(`🔁 Registrando comandos em ${configs.length} servidor(es)...`);

    for (const config of configs) {
      const guildId = config.guildId;

      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: commands }
      );

      console.log(`✅ Comandos registrados para guilda ${guildId}`);
    }

    console.log('🚀 Todos os comandos foram atualizados.');
    process.exit();
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
    process.exit(1);
  }
})();

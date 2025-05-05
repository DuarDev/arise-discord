const os = require('os');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const formatUptime = require('../utils/formatUpTime');
const pidusage = require('pidusage');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra a latência e informações do bot.'),

  async execute(interaction, client) {
    // Envia resposta inicial
    await interaction.reply({ content: 'Calculando...' });

    // Busca a resposta para calcular a latência
    const sent = await interaction.fetchReply();

    const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping)>= 0 ? `${client.ws.ping} ms` : 'Indisponível';

    const uptime = formatUptime(client.uptime);

    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // em MB
    const totalMemory = os.totalmem() / 1024 / 1024;
    const stats = await pidusage(process.pid);
    const cpuPercent = stats.cpu.toFixed(1); // uso de CPU em %
    
    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setColor(0x00AE86)
      .addFields(
        { name: '📡 Latência do Bot', value: `${botLatency}ms`, inline: true },
        { name: '🛰️ Latência da API', value: `${apiLatency}`, inline: true },
        { name: '⏱️ Uptime', value: uptime, inline: true },
        { name: '💾 Memória usada', value: `${memoryUsage.toFixed(2)} MB / ${totalMemory.toFixed(2)} MB`, inline: true },
        { name: '⚙️ Carga da CPU (1 min)', value: `${cpuPercent}%`, inline: true },
        { name: '🧠 Node.js', value: process.version, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
  },
};

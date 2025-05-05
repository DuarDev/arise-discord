const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const GuildConfig = require('../models/GuildConfig');

const ip = 'arise.minehost.com.br';
const bannerUrl = 'https://media.discordapp.net/attachments/1367514274855129200/1367951198879088741/ChatGPT_Image_2_de_mai._de_2025_16_47_35.png?ex=68167355&is=681521d5&hm=cfb46e0409f54560ceb7a679bdea86406850d778f94b31f4ff6bb04b1b981d9f&=&format=webp&quality=lossless&width=1376&height=917';
const adminNicks = ['DuduC_'];

async function updateStatus(client) {
  const configs = await GuildConfig.find({ statusChannelId: { $ne: null } });

  for (const config of configs) {
    try {
      const guild = client.guilds.cache.get(config.guildId);
      if (!guild) continue;

      const channel = guild.channels.cache.get(config.statusChannelId);
      if (!channel || !channel.isTextBased()) continue;

      const response = await axios.get(`https://api.mcsrvstat.us/2/${ip}`);
      const data = response.data;

      const allPlayers = data.players?.list || [];
      const onlineAdmins = allPlayers.filter(name =>
        adminNicks.some(admin => admin.toLowerCase() === name.toLowerCase())
      );
      const adminListText = onlineAdmins.length
        ? onlineAdmins.join(', ')
        : 'Nenhum admin online';

      const embed = new EmbedBuilder()
        .setTitle(data.online ? '🟢 Servidor de Minecraft Online' : '🔴 Servidor Offline ou não encontrado')
        .setColor(data.online ? 0x2ecc71 : 0xe74c3c)
        .setImage(bannerUrl)
        .addFields(
          { name: '🌍 MOTD', value: data.motd?.clean?.[0] || 'N/A' },
          { name: '👥 Jogadores', value: `${data.players?.online || 0} / ${data.players?.max || 0}`, inline: true },
          { name: '🕹️ Versão', value: data.version || 'N/A', inline: true },
          { name: '📡 IP', value: ip, inline: false },
          { name: '🛡️ Admins online', value: adminListText, inline: false }
        )
        .setTimestamp();

      if (config.statusMessageId) {
        try {
          const message = await channel.messages.fetch(config.statusMessageId);
          await message.edit({ embeds: [embed] });
        } catch (error) {
          const sentMessage = await channel.send({ embeds: [embed] });
          config.statusMessageId = sentMessage.id;
          await config.save();
        }
      } else {
        const sentMessage = await channel.send({ embeds: [embed] });
        config.statusMessageId = sentMessage.id;
        await config.save();
      }
    } catch (error) {
      console.error(`Erro ao atualizar status para o servidor ${config.guildId}:`, error);
    }
  }
}

function startStatusUpdater(client) {
  // Atualiza imediatamente ao iniciar
  updateStatus(client);

  // Atualiza a cada 60 segundos
  setInterval(() => updateStatus(client), 60000);
}

module.exports = startStatusUpdater;

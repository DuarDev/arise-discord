const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Mostra o status do servidor de Minecraft'),

  async execute(interaction) {
    await interaction.deferReply();

    const ip = 'arise.minehost.com.br';
    const bannerUrl = 'https://media.discordapp.net/attachments/1367514274855129200/1367951198879088741/ChatGPT_Image_2_de_mai._de_2025_16_47_35.png?ex=68167355&is=681521d5&hm=cfb46e0409f54560ceb7a679bdea86406850d778f94b31f4ff6bb04b1b981d9f&=&format=webp&quality=lossless&width=1376&height=917';

    // Lista de nicks considerados administradores
    const adminNicks = ['DuduC_', 'EuAmoMeusGatos', 'O1Jovem'];

    try {
      const response = await axios.get(`https://api.mcsrvstat.us/2/${ip}`);
      const data = response.data;

      if (!data.online) throw new Error('Servidor offline');

      const allPlayers = data.players?.list || [];

      const onlineAdmins = allPlayers.filter(name =>
        adminNicks.some(admin => admin.toLowerCase() === name.toLowerCase())
      );

      const adminListText = onlineAdmins.length
        ? onlineAdmins.join(', ')
        : 'Nenhum admin online';

      const embed = new EmbedBuilder()
        .setTitle('🟢 Servidor de Minecraft Online')
        .setColor(0x2ecc71)
        .setImage(bannerUrl)
        .addFields(
          { name: '🌍 MOTD', value: data.motd?.clean?.[0] || 'N/A' },
          { name: '👥 Jogadores', value: `${data.players.online} / ${data.players.max}`, inline: true },
          { name: '🕹️ Versão', value: data.version, inline: true },
          { name: '📡 IP', value: ip, inline: false },
          { name: '🛡️ Admins online', value: adminListText, inline: false }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      const offlineEmbed = new EmbedBuilder()
        .setTitle('🔴 Servidor Offline ou não encontrado')
        .setDescription('Não foi possível consultar o status do servidor.')
        .setColor(0xe74c3c)
        .setTimestamp();

      await interaction.editReply({ embeds: [offlineEmbed] });
    }
  },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserStats = require('../models/UserStats');

const XP_TO_LEVEL = 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Exibe seu perfil ou o de outro membro')
    .addUserOption(option =>
      option.setName('membro')
        .setDescription('Membro para exibir o perfil')
        .setRequired(false)
    ),

  async execute(interaction) {
    const member = interaction.options.getMember('membro') || interaction.member;
    const user = member.user;

    // Buscar dados de XP
    const userId = user.id;
    const guildId = interaction.guild.id;
    let stats = await UserStats.findOne({ userId, guildId });

    if (!stats) {
      stats = await UserStats.create({ userId, guildId });
    }

    const neededXp = XP_TO_LEVEL * stats.level;
    const progress = stats.xp / neededXp;
    const totalBars = 10;
    const filledBars = Math.floor(progress * totalBars);
    const bar = '█'.repeat(filledBars) + '░'.repeat(totalBars - filledBars);

    const embed = new EmbedBuilder()
      .setTitle(`👤 Perfil de ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📛 Tag', value: `@${user.tag}`, inline: true },
        { name: '📅 Entrou no servidor em', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true },
        { name: '📆 Conta criada em', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👥 Total de membros', value: `${interaction.guild.memberCount}`, inline: true },
        { name: '🏅 Nível', value: `${stats.level}`, inline: true },
        { name: '⚡ XP', value: `${stats.xp} / ${neededXp}`, inline: true },
        { name: '📈 Progresso', value: `\`${bar}\``, inline: false }
      )
      .setColor(0x3498db)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

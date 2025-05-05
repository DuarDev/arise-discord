// events/guildMemberAdd.js
const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {
    const guildId = member.guild.id;

    try {
      const config = await GuildConfig.findOne({ guildId });
      if (!config) return;

      // Mensagem de boas-vindas
      if (config.welcomeChannelId) {
        const channel = member.guild.channels.cache.get(config.welcomeChannelId);
        if (channel && channel.isTextBased()) {
          const embed = new EmbedBuilder()
            .setTitle('🎉 Bem-vindo(a) ao servidor!')
            .setDescription(`Seja bem-vindo, ${member}!`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
              { name: '👤 Nome de usuário', value: `${member.user.username}`, inline: true },
              { name: '📅 Conta criada em', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`, inline: true },
              { name: '🧑‍🤝‍🧑 Membros totais', value: `${member.guild.memberCount}`, inline: true }
            )
            .setColor(0x00AE86)
            .setFooter({ text: `ID do usuário: ${member.id}` })
            .setTimestamp();

          await channel.send({ embeds: [embed] });
        }
      }

      // AutoRole
      if (config.autoRoleId) {
        const role = member.guild.roles.cache.get(config.autoRoleId);
        if (role) {
          await member.roles.add(role);
          console.log(`[AutoRole] Cargo "${role.name}" atribuído a ${member.user.tag}`);
        } else {
          console.warn(`[AutoRole] Cargo com ID ${config.autoRoleId} não encontrado em ${member.guild.name}`);
        }
      }

    } catch (err) {
      console.error(`[guildMemberAdd] Erro ao processar entrada de membro:`, err);
    }
  },
};

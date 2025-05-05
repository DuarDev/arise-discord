const UserStats = require('../models/UserStats');

const COOLDOWN = 60 * 1000; // 1 minuto
const XP_PER_MESSAGE = [10, 20];
const XP_TO_LEVEL = 1000;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    // Ignorar bots e mensagens fora de servidores
    if (message.author.bot || !message.guild) return;

    const { id: userId } = message.author;
    const { id: guildId } = message.guild;

    let stats = await UserStats.findOne({ userId, guildId });

    // Criar se não existir
    if (!stats) {
      stats = await UserStats.create({ userId, guildId });
    }

    const now = Date.now();
    if (stats.lastMessage && now - stats.lastMessage.getTime() < COOLDOWN) return;

    // Gerar XP aleatório
    const xpGain = Math.floor(Math.random() * (XP_PER_MESSAGE[1] - XP_PER_MESSAGE[0] + 1)) + XP_PER_MESSAGE[0];
    stats.xp += xpGain;
    stats.lastMessage = new Date();

    // Verifica se subiu de nível
    const neededXp = XP_TO_LEVEL * stats.level;
    if (stats.xp >= neededXp) {
      stats.level += 1;
      stats.xp = stats.xp - neededXp;

      // Opcional: enviar mensagem de parabéns no canal
      message.channel.send(`🎉 ${message.author}, você subiu para o nível ${stats.level}!`);
    }

    await stats.save();
  }
};

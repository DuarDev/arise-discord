// models/GuildConfig.js
const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  welcomeChannelId: { type: String, default: null },
  statusChannelId: { type: String, default: null },
  statusMessageId: { type: String, default: null },
  autoRoleId: { type: String, default: null }, // ✅ NOVO CAMPO
}, {
  timestamps: true,
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);

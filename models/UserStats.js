const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  lastMessage: { type: Date, default: null }
}, {
  timestamps: true
});

userStatsSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('UserStats', userStatsSchema);

const mongoose = require('mongoose');

async function loadMongo() {
    if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🟢 Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB:', err);
    process.exit(1);
  }
}

module.exports = loadMongo;

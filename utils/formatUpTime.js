function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
    const parts = [];
    if (days) parts.push(`${days} dia${days > 1 ? 's' : ''}`);
    if (hours) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
    if (minutes) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
    if (seconds) parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`);
  
    return parts.join(', ') || 'menos de 1 segundo';
  }
  
  module.exports = formatUptime;
  
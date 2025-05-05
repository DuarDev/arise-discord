const startStatusUpdater = require('../services/statusUpdater');

function loadStatus(client) {
  startStatusUpdater(client);
}
module.exports = loadStatus;

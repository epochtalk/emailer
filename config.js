/* jshint node: true */
'use strict';

var config = {
  socketPath: process.env.EMAILER_SOCKET_PATH || '/tmp/epochEmailer.sock',
  senderEmail: process.env.EMAILER_SENDER_EMAIL || 'info@epochtalk.com',
  hostUrl: process.env.EMAILER_HOST_URL || 'http://localhost:8080',
  logEnabled: process.env.EMAILER_LOG_ENABLED || true
};

module.exports = config;
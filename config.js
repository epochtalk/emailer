var emailerSocketPath = '/var/run/epochEmailer.sock';
if (os === 'darwin') {
  emailerSocketPath = '/tmp/epochEmailer.sock';
}

var config = {
  socketPath: process.env.EMAILER_SOCKET_PATH || emailerSocketPath,
  senderEmail: process.env.EMAILER_SENDER_EMAIL || 'info@epochtalk.com',
  logEnabled: process.env.EMAILER_LOG_ENABLED || true
};

module.exports = config;

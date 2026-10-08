const http = require('http');
const app = require('./app');
const { initSocket } = require('./sockets/socketServer');
const { port, nodeEnv } = require('./config/env');

const server = http.createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`\n🚀 Server on http://localhost:${port}`);
  console.log(`🌍 Env: ${nodeEnv}\n`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  server.close(() => process.exit(1));
});
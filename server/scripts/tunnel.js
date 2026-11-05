import localtunnel from 'localtunnel';

const PORT = 5000;
let currentTunnel = null;

async function startTunnel() {
  try {
    console.log(`Connecting localtunnel to port ${PORT}...`);
    currentTunnel = await localtunnel({
      port: PORT,
      subdomain: 'battle-of-the-maroons-live'
    });

    console.log(`\n=============================================================`);
    console.log(`🚀 PUBLIC LIVE TUNNEL ACTIVE:`);
    console.log(`👉 ${currentTunnel.url}`);
    console.log(`👉 Gate Scanner: ${currentTunnel.url}/scanner`);
    console.log(`=============================================================\n`);

    currentTunnel.on('close', () => {
      console.warn('⚠️ Tunnel closed. Reconnecting in 3 seconds...');
      setTimeout(startTunnel, 3000);
    });

    currentTunnel.on('error', (err) => {
      console.warn('⚠️ Tunnel error:', err.message, 'Reconnecting in 3 seconds...');
      try { currentTunnel.close(); } catch (e) {}
      setTimeout(startTunnel, 3000);
    });
  } catch (err) {
    console.warn('⚠️ Tunnel connection failed, trying random subdomain in 3 seconds...');
    try {
      currentTunnel = await localtunnel({ port: PORT });
      console.log(`🚀 PUBLIC LIVE TUNNEL ACTIVE: ${currentTunnel.url}`);
    } catch (e) {
      setTimeout(startTunnel, 3000);
    }
  }
}

startTunnel();

// Keep node alive indefinitely
setInterval(() => {}, 1000 * 60 * 60);


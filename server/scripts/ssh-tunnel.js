import { spawn } from 'child_process';

let sshProcess = null;
let currentUrl = null;

function startTunnel() {
  console.log('🚀 Connecting direct SSH tunnel to port 5000 (No passwords, pure HTTPS)...');
  
  sshProcess = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ServerAliveCountMax=3',
    '-R', '80:localhost:5000',
    'nokey@localhost.run'
  ]);

  sshProcess.stdout.on('data', handleOutput);
  sshProcess.stderr.on('data', handleOutput);

  sshProcess.on('close', (code) => {
    console.warn(`Tunnel process exited with code ${code}. Reconnecting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });
}

function handleOutput(data) {
  const str = data.toString();
  const match = str.match(/https:\/\/[a-z0-9]+\.lhr\.life/i);
  if (match) {
    currentUrl = match[0];
    console.log('\n=============================================================');
    console.log('🎉 100% DIRECT LIVE MOBILE LINK READY (NO PASSWORDS NEEDED):');
    console.log(`👉 Main Website:  ${currentUrl}`);
    console.log(`👉 Gate Scanner:  ${currentUrl}/scanner`);
    console.log(`👉 Admin Panel:   ${currentUrl}/#/admin`);
    console.log('=============================================================\n');
  }
}

startTunnel();

// Keep alive
setInterval(() => {}, 1000 * 60 * 60);


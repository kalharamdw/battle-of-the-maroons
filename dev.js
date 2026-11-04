import { spawn } from 'child_process';

console.log('\x1b[33m%s\x1b[0m', '🏏 ======================================================== 🏏');
console.log('\x1b[33m%s\x1b[0m', '   BATTLE OF THE MAROONS — STARTING DUAL-STACK DEV ENVIRONMENT');
console.log('\x1b[33m%s\x1b[0m', '   Backend API:  http://localhost:5000');
console.log('\x1b[33m%s\x1b[0m', '   Frontend Web: http://localhost:3000');
console.log('\x1b[33m%s\x1b[0m', '🏏 ======================================================== 🏏\n');

// 1. Launch Node Express Backend Server (Port 5000 + MongoDB Atlas)
const backend = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true
});

// 2. Launch Vite Frontend Dev Server (Port 3000)
const frontend = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = (code) => {
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(code || 0);
};

process.on('SIGINT', () => cleanup(0));
process.on('SIGTERM', () => cleanup(0));
process.on('exit', () => cleanup(0));

backend.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[Backend Error] Server process exited with code ${code}\x1b[0m`);
  }
});

frontend.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`\x1b[31m[Frontend Error] Vite process exited with code ${code}\x1b[0m`);
  }
});

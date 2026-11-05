import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';

/**
 * Auto-Start Backend Plugin
 * 
 * Ensures the Node.js Express backend (Port 5000) is running whenever Vite runs.
 * If port 5000 is not responding, spawns `node server/index.js` automatically.
 */
function autoStartBackendPlugin() {
  let backendChild = null;

  return {
    name: 'auto-start-backend',
    configureServer(server) {
      const checkReq = http.get('http://127.0.0.1:5000/api/health', (res) => {
        if (res.statusCode === 200) {
          console.log('\x1b[32m%s\x1b[0m', ' [Dual-Stack] Backend API on port 5000 is active.');
        }
      });

      checkReq.on('error', () => {
        console.log('\x1b[33m%s\x1b[0m', ' [Dual-Stack] Backend on port 5000 not detected. Auto-spawning server/index.js...');
        try {
          backendChild = spawn('node', ['server/index.js'], {
            stdio: 'inherit',
            shell: true,
            cwd: process.cwd()
          });

          backendChild.on('error', (err) => {
            console.error('\x1b[31m%s\x1b[0m', `Failed to spawn backend process: ${err.message}`);
          });
        } catch (err) {
          console.error('\x1b[31m%s\x1b[0m', `Error auto-starting backend: ${err.message}`);
        }
      });

      checkReq.setTimeout(800, () => {
        checkReq.destroy();
      });

      // Cleanup on server close
      const cleanUp = () => {
        if (backendChild) {
          try {
            backendChild.kill();
          } catch (e) { }
        }
      };

      server.httpServer?.on('close', cleanUp);
      process.on('SIGINT', cleanUp);
      process.on('SIGTERM', cleanUp);
      process.on('exit', cleanUp);
    }
  };
}

/**
 * Dedicated Static Video Streaming Plugin
 * 
 * Directly serves and streams any video files located in public/assets/videos/
 * with proper HTTP 206 Partial Content (Range requests) and video/mp4 MIME type.
 * This guarantees newly dropped videos play immediately without requiring Vite server restarts.
 */
function videoStreamPlugin() {
  return {
    name: 'video-stream-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url.startsWith('/assets/videos/') && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov'))) {
          const filePath = path.join(process.cwd(), 'public', url);
          if (fs.existsSync(filePath)) {
            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const range = req.headers.range;
            const contentType = url.endsWith('.webm') ? 'video/webm' : 'video/mp4';

            const baseHeaders = {
              'Accept-Ranges': 'bytes',
              'Content-Type': contentType,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
              'Access-Control-Allow-Origin': '*'
            };

            if (range) {
              const parts = range.replace(/bytes=/, '').split('-');
              const start = parseInt(parts[0], 10);
              const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
              const chunksize = (end - start) + 1;
              const file = fs.createReadStream(filePath, { start, end });
              res.writeHead(206, {
                ...baseHeaders,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Content-Length': chunksize
              });
              file.pipe(res);
              return;
            } else {
              res.writeHead(200, {
                ...baseHeaders,
                'Content-Length': fileSize
              });
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          } else {
            // Clean 404 for missing video files so Vite SPA fallback does NOT return index.html
            res.writeHead(404, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-cache' });
            res.end('Video not found');
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  root: './',
  publicDir: 'public',
  plugins: [autoStartBackendPlugin(), videoStreamPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/public/assets/videos/**', '**/*.mp4', '**/*.webm']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/scanner': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/gate': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});

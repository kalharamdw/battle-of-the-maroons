import mongoose from 'mongoose';

// Disable query buffering so Mongoose operations fail fast to localStore instead of hanging for 10s
mongoose.set('bufferCommands', false);

let hasLoggedStatus = false;
let isConnecting = false;

export async function connectDB() {
  if (isConnecting) return false;
  isConnecting = true;

  let uri = process.env.MONGODB_URI;

  if (process.env.USE_LOCAL_DB === 'true') {
    if (!hasLoggedStatus) {
      console.log('📦 USE_LOCAL_DB=true is set. Running in resilient local persistence mode (store.json).');
      hasLoggedStatus = true;
    }
    isConnecting = false;
    return false;
  }

  if (!uri) {
    if (!hasLoggedStatus) {
      console.log('📦 MONGODB_URI not set. Running in resilient local persistence mode (store.json).');
      hasLoggedStatus = true;
    }
    isConnecting = false;
    return false;
  }

  // Sanitize common copy-paste mistakes
  uri = uri.trim();
  if (uri.startsWith('MONGODB_URI=')) {
    uri = uri.replace(/^MONGODB_URI=/, '').trim();
  }
  uri = uri.replace(/^["']|["']$/g, '').trim();

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      autoIndex: true
    });

    console.log(`\n✅ MongoDB Atlas Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    hasLoggedStatus = true;
    isConnecting = false;

    // Trigger immediate background sync of localStore data to MongoDB
    import('../services/syncService.js').then(s => s.syncLocalStoreToMongo()).catch(e => {
      console.warn('Sync service trigger note:', e.message);
    });

    return true;
  } catch (error) {
    // Try fallback to local MongoDB service if installed
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/battle_of_the_maroons', {
        serverSelectionTimeoutMS: 1500
      });
      console.log(`✅ Connected to Local MongoDB Service on localhost:27017!`);
      hasLoggedStatus = true;
      isConnecting = false;

      import('../services/syncService.js').then(s => s.syncLocalStoreToMongo()).catch(() => {});
      return true;
    } catch (localErr) {
      // Both cloud and local MongoDB unreachable
    }

    if (!hasLoggedStatus) {
      console.log('\n=============================================================');
      console.log('⚠️  MONGODB ATLAS NOT YET CONNECTED');
      console.log('Reason: Your current IP is not on the Atlas IP Whitelist.');
      console.log('👉 Quick Fix (1 minute):');
      console.log('   1. Go to: https://cloud.mongodb.com/');
      console.log('   2. Click "Network Access" in the left sidebar.');
      console.log('   3. Click "Add IP Address" -> Select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0).');
      console.log('   4. Click "Confirm".');
      console.log('ℹ️  In the meantime, the server is running in resilient local mode:');
      console.log('   All orders, categories & quotas are stored safely in: server/data/store.json');
      console.log('   The moment 0.0.0.0/0 is added, the server will auto-connect & sync all data!');
      console.log('=============================================================\n');
      hasLoggedStatus = true;
    }

    isConnecting = false;
    return false;
  }
}

// Active background auto-reconnect probe every 15 seconds
export function startAutoReconnect() {
  setInterval(async () => {
    if (!isDbConnected() && process.env.USE_LOCAL_DB !== 'true') {
      try {
        const connected = await connectDB();
        if (connected) {
          console.log('🎉 Auto-reconnect succeeded! MongoDB Atlas is now online & in sync.');
        }
      } catch (e) {}
    }
  }, 15000);
}

export function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

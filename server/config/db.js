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

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    isConnecting = false;
    return true;
  } catch (error) {
    // Try fallback to local MongoDB service if installed
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/battle_of_the_maroons', {
        serverSelectionTimeoutMS: 1500
      });
      console.log(`✅ Connected to Local MongoDB Service on localhost:27017!`);
      isConnecting = false;
      return true;
    } catch (localErr) {
      // Both cloud and local MongoDB unreachable
    }

    if (!hasLoggedStatus) {
      console.log('\n=============================================================');
      console.log('📦 RUNNING IN HIGH-PERFORMANCE LOCAL DATABASE MODE');
      console.log('ℹ️  All ticket orders, categories, inquiries, matches & stats');
      console.log('    are stored permanently in: server/data/store.json');
      console.log('💡 The website and admin panel are 100% functional without MongoDB.');
      console.log('👉 To connect MongoDB Atlas later: whitelist 0.0.0.0/0 in Atlas Network Access');
      console.log('=============================================================\n');
      hasLoggedStatus = true;
    }

    isConnecting = false;
    return false;
  }
}

// Gentle background probe every 2 minutes without spamming console
export function startAutoReconnect() {
  setInterval(async () => {
    if (!isDbConnected() && process.env.USE_LOCAL_DB !== 'true') {
      try {
        await connectDB();
      } catch (e) {}
    }
  }, 120000);
}

export function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

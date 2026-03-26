const mongoose = require('mongoose');

const connectDB = async () => {
    let uri = process.env.MONGO_URI || '';

    // If no real MongoDB URI is provided, or it's still a placeholder,
    // spin up an in-memory MongoDB instance for demo/development
    const isPlaceholder = !uri || uri.includes('localhost:27017') || uri.includes('your_');

    // First try the real URI (local or Atlas)
    if (!isPlaceholder) {
        try {
            const conn = await mongoose.connect(uri);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (err) {
            console.warn(`⚠️  Could not connect to ${uri} — falling back to in-memory DB`);
        }
    }

    // Try local MongoDB first (if installed)
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/farmai', { serverSelectionTimeoutMS: 2000 });
        console.log('✅ MongoDB Connected: localhost:27017');
        return;
    } catch (_) {
        // Local MongoDB not available — use in-memory server
    }

    // In-memory MongoDB (no installation needed — perfect for demo!)
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memUri = mongod.getUri();
        await mongoose.connect(memUri);
        console.log('✅ MongoDB Connected: In-Memory (demo mode — data resets on restart)');
        console.log('   💡 To persist data, set MONGO_URI in backend/.env to a real MongoDB URI');

        // Graceful shutdown
        process.on('SIGINT', async () => { await mongod.stop(); process.exit(0); });
        process.on('SIGTERM', async () => { await mongod.stop(); process.exit(0); });
    } catch (err) {
        console.error('❌ Failed to start any MongoDB:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

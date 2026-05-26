import mongoose from "mongoose";

// Cache the connection across warm serverless invocations
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const t0 = Date.now();
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
        // Fail fast if the DB is unreachable — a paused Atlas free-tier
        // cluster otherwise hangs the whole serverless function
        serverSelectionTimeoutMS: 8000,
        socketTimeoutMS: 30000,
        connectTimeoutMS: 8000,
      })
      .then((conn) => {
        console.log(`[mongo] connected in ${Date.now() - t0}ms`);
        return conn;
      })
      .catch((err) => {
        console.error(`[mongo] connect failed after ${Date.now() - t0}ms:`, err.message);
        throw err;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

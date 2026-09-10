import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB with connection caching to avoid multiple connections in serverless/dev environments.
 * Returns null if MONGODB_URI is not set or connection fails, allowing graceful fallback to in-memory datasets.
 */
export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    console.warn(
      "[Go-Bharat DB] MONGODB_URI is not defined in environment. Running in graceful in-memory fallback mode."
    );
    return null;
  }

  if (cached.conn) {
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting.
    // A cached connection that died (network blip / Atlas failover) must not be
    // handed back to callers, or every query fails with
    // "Client must be connected before running operations".
    if (mongoose.connection.readyState !== 0) {
      return cached.conn;
    }
    console.warn("[Go-Bharat DB] Cached connection is disconnected; reconnecting...");
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("[Go-Bharat DB] Successfully connected to MongoDB.");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("[Go-Bharat DB] MongoDB connection error:", err);
        cached.promise = null;
        return null as any;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("[Go-Bharat DB] Failed to establish MongoDB connection:", error);
    cached.promise = null;
    return null;
  }
}

export default connectToDatabase;

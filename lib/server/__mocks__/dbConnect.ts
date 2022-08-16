import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Same as dbConnect.ts, but we use a memory-server for fast/safe testing
 */

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  let mongoServer: MongoMemoryServer;
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    mongoServer = await MongoMemoryServer.create();

    cached.promise = mongoose
      .connect(mongoServer.getUri(), opts)
      .then((mongoose) => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;

  const disconnect = cached.conn.disconnect;
  cached.conn.disconnect = () => {
    disconnect();
    mongoServer.stop();

    // TODO make sure this is the best method
    // If tests run on same thread, we need to reset after stopping a server
    cached.conn = null;
    cached.promise = null;
  };
  return cached.conn;
}

export default dbConnect;

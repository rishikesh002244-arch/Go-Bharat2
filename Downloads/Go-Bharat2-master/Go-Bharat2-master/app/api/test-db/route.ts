import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json({ ok: false, error: "MONGODB_URI is not set in .env.local" });
  }

  // Show the host part (hide password)
  const safeUri = uri.replace(/:([^@]+)@/, ":****@");

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
      bufferCommands: false,
    });

    const dbName = conn.connection.db?.databaseName;
    const host = conn.connection.host;

    await mongoose.disconnect();

    return NextResponse.json({
      ok: true,
      message: "✅ MongoDB connected successfully!",
      database: dbName,
      host: host,
      uri_used: safeUri,
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      error: err?.message || String(err),
      uri_used: safeUri,
      hint: "Check that the hostname in MONGODB_URI is the real Atlas cluster hostname (get it from Atlas > Connect > Drivers)",
    });
  }
}

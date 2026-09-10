import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json({ ok: false, error: "MONGODB_URI is not set in .env.local" });
  }

  // Show the host part (hide password)
  const safeUri = uri.replace(/:([^@]+)@/, ":****@");

  // IMPORTANT: use a dedicated connection instead of the default mongoose
  // instance. Calling mongoose.disconnect() on the default instance would tear
  // down the shared cached connection in lib/mongodb.ts and break every other
  // API route (e.g. auth) with "Client must be connected before running
  // operations" until the dev server restarts.
  let diagnosticConn: mongoose.Connection | null = null;

  try {
    diagnosticConn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 6000,
      bufferCommands: false,
    }).asPromise();

    const dbName = diagnosticConn.db?.databaseName;
    const host = diagnosticConn.host;

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
  } finally {
    // Close only the dedicated diagnostic connection, never the shared one.
    if (diagnosticConn) {
      await diagnosticConn.close().catch(() => {});
    }
  }
}

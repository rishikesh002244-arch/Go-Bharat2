import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      return NextResponse.json({ status: 'ok', mongodb: true });
    } else {
      return NextResponse.json({ status: 'ok', mongodb: false, warning: 'MONGODB_URI not configured, using in‑memory fallback' }, { status: 200 });
    }
  } catch (error) {
    console.error('[Health Check] MongoDB connection error:', error);
    return NextResponse.json({ status: 'error', mongodb: false, error: String(error) }, { status: 500 });
  }
}

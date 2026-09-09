import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, verifyToken } from "@/lib/jwt";
import {
  getUserProgress,
  recordOffbeatVisit,
  SIHStorageUnavailableError,
} from "@/routes/sih/progress";

export const runtime = "nodejs";

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return token ? (await verifyToken(token))?.userId : undefined;
}

function errorResponse(error: unknown) {
  if (error instanceof SIHStorageUnavailableError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: error instanceof Error ? error.message : "Could not update digital passport.",
    },
    { status: 400 }
  );
}

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    return NextResponse.json({ success: true, data: await getUserProgress(userId) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      data: await recordOffbeatVisit(userId, body.locationId),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

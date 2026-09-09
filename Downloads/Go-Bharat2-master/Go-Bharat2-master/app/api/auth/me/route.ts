import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Session expired or invalid token" },
        { status: 401 }
      );
    }

    const mongooseConn = await connectToDatabase();
    if (!mongooseConn) {
      return NextResponse.json(
        { success: false, error: "MongoDB is unavailable. User data could not be verified." },
        { status: 503 }
      );
    }

    const dbUser = await User.findById(payload.userId).lean();
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User record was not found in MongoDB." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const full = searchParams.get("full") === "1";

    return NextResponse.json({
      success: true,
      user: {
        userId: dbUser._id.toString(),
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role || "user",
        ...(full
          ? {
              avatar: dbUser.avatar || "",
              savedTrips: dbUser.savedTrips || [],
              createdAt: dbUser.createdAt,
            }
          : {}),
      },
    });
  } catch (error: unknown) {
    console.error("[Auth Me Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to authenticate session" },
      { status: 500 }
    );
  }
}

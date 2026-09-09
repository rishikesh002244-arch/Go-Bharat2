import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, validateEmail } from "@/lib/auth";
import { signToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/jwt";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  try {
    // Rate limit check: max 10 login attempts per IP per minute
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "login-client";

    const rateLimit = checkRateLimit(`login_${ip}`, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again in ${rateLimit.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload in request." },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter your password." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Authentication is MongoDB-only. Silent in-memory fallback would make
    // accounts appear to exist while losing their data on process restart.
    const mongooseConn = await connectToDatabase();
    if (!mongooseConn) {
      return NextResponse.json(
        {
          success: false,
          error: "Login is temporarily unavailable because MongoDB is not connected.",
        },
        { status: 503 }
      );
    }

    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user || !user.password || !(await comparePassword(password, user.password))) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password. Please check your credentials.",
        },
        { status: 401 }
      );
    }

    const userPayload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = await signToken(userPayload);
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful! Welcome back to Go-Bharat 🇮🇳",
        user: userPayload,
      },
      { status: 200 }
    );
    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    console.error("[Go-Bharat Auth] Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "An unexpected server error occurred during login. Please try again.",
      },
      { status: 500 }
    );
  }
}

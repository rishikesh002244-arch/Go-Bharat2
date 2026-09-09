import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, validateEmail, validatePassword } from "@/lib/auth";
import { signToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload in request." },
        { status: 400 }
      );
    }

    const { name, email, password } = body;

    // 1. Input validations
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      return NextResponse.json(
        { success: false, error: passwordCheck.message },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // A successful account response must represent a durable MongoDB write.
    // Do not fall back to memory here; that would create accounts that vanish
    // on restart and falsely look like persisted user data.
    const mongooseConn = await connectToDatabase();
    if (!mongooseConn) {
      return NextResponse.json(
        {
          success: false,
          error: "Account creation is temporarily unavailable because MongoDB is not connected. No account was created.",
        },
        { status: 503 }
      );
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists. Please log in.",
        },
        { status: 409 }
      );
    }

    const newUser = await User.create({
      name: cleanName,
      email: normalizedEmail,
      password: await hashPassword(password),
      role: "user",
      savedTrips: [],
    });

    const userPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    const token = await signToken(userPayload);
    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Welcome to Go-Bharat 🇮🇳",
        user: userPayload,
      },
      { status: 201 }
    );
    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
    return response;
  } catch (error: any) {
    console.error("[Go-Bharat Auth] Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "An unexpected server error occurred during registration. Please try again.",
      },
      { status: 500 }
    );
  }
}

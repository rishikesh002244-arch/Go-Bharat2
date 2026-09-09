import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/jwt";

// Paths that strictly require authentication
const PROTECTED_PATHS = ["/plan-trip", "/profile", "/admin"];

// Paths that should redirect to home if already authenticated
const AUTH_PATHS = ["/login", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPage = AUTH_PATHS.some((path) => pathname === path);
  const isAdminPath = pathname.startsWith("/admin");

  let isAuthenticated = false;
  let role = "user";
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      isAuthenticated = true;
      role = (payload.role as string) || "user";
    }
  }

  // If user tries to access protected page without valid token
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes require admin role
  if (isAdminPath && isAuthenticated && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If already authenticated user tries to access /login or /sign-up
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svgs, etc)
     * - api routes (handled by API handlers)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

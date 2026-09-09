"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || "Invalid email or password.");
        setLoading(false);
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect") || "/";
        router.push(redirect);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/signup-bg.png')" }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* HEADER */}
        <header className="w-full border-b border-white/10 bg-black/25 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            {/* LOGO */}
            <Link
              href="/"
              className="text-3xl font-extrabold tracking-tight text-white"
            >
              <span>Go-</span>
              <span className="text-orange-500">Bharat</span>
            </Link>

            {/* NAVIGATION */}
            <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">
              <Link href="/" className="transition hover:text-orange-400">
                Home
              </Link>
              <Link href="/places" className="transition hover:text-orange-400">
                Places
              </Link>
              <Link href="/hotels" className="transition hover:text-orange-400">
                Hotels
              </Link>
              <Link href="/food" className="transition hover:text-orange-400">
                Food
              </Link>
              <Link href="/culture" className="transition hover:text-orange-400">
                Culture
              </Link>
              <Link href="/about" className="transition hover:text-orange-400">
                About
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full border border-white/30 px-5 py-2 transition hover:border-orange-400 hover:text-orange-400"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </header>

        {/* MAIN */}
        <section className="mx-auto flex flex-1 max-w-7xl items-center justify-center px-6 py-10">
          <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="hidden text-white lg:block">
              <p className="mb-5 text-sm font-bold tracking-[0.35em] text-orange-400">
                WELCOME BACK • EXPLORE • DISCOVER
              </p>

              <h1 className="text-6xl font-extrabold leading-tight">
                Continue
                <br />
                Your
                <br />
                <span className="text-orange-500">Journey</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">
                Your next Indian adventure is waiting. Sign in to continue
                discovering breathtaking destinations, hotels, and customized AI
                travel plans.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-md">
                  🏛️ Heritage
                </div>
                <div className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-md">
                  🏔️ Adventure
                </div>
                <div className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur-md">
                  🌊 Beaches
                </div>
              </div>

              <div className="mt-10">
                <p className="text-lg font-semibold">📍 Incredible India</p>
                <p className="mt-1 text-xs tracking-[0.3em] text-white/60">
                  ONE COUNTRY • MILLIONS OF STORIES
                </p>
              </div>
            </div>

            {/* LOGIN CARD */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-3xl border border-white/20 bg-black/60 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
                {/* HEADING */}
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 text-2xl">
                    👋
                  </div>
                  <h2 className="text-3xl font-extrabold text-white">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-sm text-white/60">
                    Sign in to continue your Go-Bharat journey.
                  </p>
                </div>

                {/* ERROR ALERT */}
                {error && (
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/20 p-3.5 text-sm text-red-200">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-white"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-white outline-none placeholder:text-white/40 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-sm font-semibold text-white"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-xs font-semibold text-orange-400 hover:text-orange-300"
                        onClick={() =>
                          alert("Demo Mode: You can sign up with any password or use your registered account.")
                        }
                      >
                        Need help?
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 pr-12 text-white outline-none placeholder:text-white/40 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition hover:text-white"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In →</span>
                    )}
                  </button>
                </form>

                {/* SIGN UP */}
                <p className="mt-7 text-center text-sm text-white/60">
                  Don't have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="font-bold text-orange-400 transition hover:text-orange-300"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-black/30 px-6 py-5 text-center text-sm text-white/50">
          © 2026 Go-Bharat • Made with ❤️ for India 🇮🇳
        </footer>
      </div>
    </main>
  );
}
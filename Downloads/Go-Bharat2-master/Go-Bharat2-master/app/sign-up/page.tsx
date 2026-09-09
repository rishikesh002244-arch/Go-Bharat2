"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!terms) {
      setError("Please agree to the Terms of Service to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await signup(name.trim(), email.trim(), password);
      if (!res.success) {
        setError(res.error || "Registration failed. Please try again.");
        setLoading(false);
      } else {
        router.push("/places");
      }
    } catch (err: any) {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url('/signup-bg.png')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* HEADER */}
        <header className="border-b border-white/10 bg-black/25 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-3xl font-extrabold tracking-tight">
              <span className="text-white">Go-</span>
              <span className="text-orange-400">Bharat</span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
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
                href="/login"
                className="rounded-full border border-white/40 px-6 py-2 transition hover:bg-white hover:text-black"
              >
                Login
              </Link>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <section className="mx-auto flex flex-1 max-w-7xl items-center justify-center px-6 py-10">
          <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="hidden lg:block">
              <p className="mb-4 text-lg font-medium tracking-[0.3em] text-orange-300">
                EXPLORE • EXPERIENCE • BELONG
              </p>

              <h1 className="text-6xl font-black leading-tight">
                India
                <br />
                <span className="text-orange-400">Awaits You</span>
              </h1>

              <p className="mt-6 max-w-lg text-xl leading-8 text-white/80">
                Discover incredible places, rich cultures, delicious food, and
                personalized AI travel itineraries tailored to your style.
              </p>

              <div className="mt-8 flex gap-3">
                <span className="rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
                  🏛️ Heritage
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
                  🌄 Adventure
                </span>
                <span className="rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
                  🍛 Food
                </span>
              </div>
            </div>

            {/* SIGN UP CARD */}
            <div className="mx-auto w-full max-w-md">
              <div className="rounded-3xl border border-white/20 bg-black/60 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
                <div className="mb-6 text-center">
                  <h2 className="text-3xl font-bold">Create Your Account</h2>
                  <p className="mt-2 text-sm text-white/70">
                    Join Go-Bharat and start exploring incredible India.
                  </p>
                </div>

                {/* ERROR ALERT */}
                {error && (
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/20 p-3.5 text-sm text-red-200">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* NAME */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/45 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/45 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Create a password (min 6 chars)"
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/45 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="Confirm your password"
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/45 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {/* TERMS */}
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-white/70">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-orange-500"
                    />
                    <span>
                      I agree to explore responsibly with{" "}
                      <span className="text-orange-400">Go-Bharat</span>.
                    </span>
                  </label>

                  {/* CREATE ACCOUNT BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-lg font-bold shadow-lg shadow-orange-500/20 transition hover:bg-orange-400 active:scale-[0.98] disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account →</span>
                    )}
                  </button>
                </form>

                {/* LOGIN LINK */}
                <p className="mt-7 text-center text-sm text-white/70">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-orange-400 hover:text-orange-300"
                  >
                    Login
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
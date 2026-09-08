"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert("Login successful! Welcome back to Go-Bharat 🇮🇳");
  };

  return (
    <main
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/signup-bg.png')" }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen">

        {/* HEADER */}
        <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            {/* LOGO */}
            <Link
              href="/"
              className="text-3xl font-extrabold tracking-tight"
            >
              <span className="text-white">Go-</span>
              <span className="text-orange-500">Bharat</span>
            </Link>

            {/* NAVIGATION */}
            <nav className="hidden items-center gap-8 text-sm font-medium text-white md:flex">

              <Link
                href="/"
                className="transition hover:text-orange-400"
              >
                Home
              </Link>

              <Link
                href="/places"
                className="transition hover:text-orange-400"
              >
                Places
              </Link>

              <Link
                href="/hotels"
                className="transition hover:text-orange-400"
              >
                Hotels
              </Link>

              <Link
                href="/about"
                className="transition hover:text-orange-400"
              >
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
        <section className="mx-auto flex min-h-[calc(100vh-85px)] max-w-7xl items-center justify-center px-6 py-10">

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
                <span className="text-orange-500">
                  Journey
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">
                Your next Indian adventure is waiting.
                Sign in to continue discovering amazing
                destinations and experiences.
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
                <p className="text-lg font-semibold">
                  📍 Incredible India
                </p>

                <p className="mt-1 text-xs tracking-[0.3em] text-white/60">
                  ONE COUNTRY • MILLIONS OF STORIES
                </p>
              </div>

            </div>


            {/* LOGIN CARD */}
            <div className="flex justify-center lg:justify-end">

              <div className="w-full max-w-md rounded-3xl border border-white/20 bg-black/55 p-7 shadow-2xl backdrop-blur-xl sm:p-9">

                {/* HEADING */}
                <div className="mb-7 text-center">

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


                {/* GOOGLE */}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 font-semibold text-gray-800 shadow-lg transition hover:scale-[1.01] hover:bg-gray-100"
                >
                  <span className="text-lg font-bold">
                    G
                  </span>

                  Continue with Google
                </button>


                {/* OR */}
                <div className="my-6 flex items-center gap-4">

                  <div className="h-px flex-1 bg-white/20" />

                  <span className="text-sm font-medium text-white/60">
                    OR
                  </span>

                  <div className="h-px flex-1 bg-white/20" />

                </div>


                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

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
                          alert("Password reset feature coming soon.")
                        }
                      >
                        Forgot password?
                      </button>

                    </div>

                    <div className="relative">

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 pr-12 text-white outline-none placeholder:text-white/40 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 transition hover:text-white"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>

                    </div>

                  </div>


                  {/* REMEMBER ME */}
                  <div className="flex items-center gap-3">

                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="h-4 w-4 accent-orange-500"
                    />

                    <label
                      htmlFor="remember"
                      className="text-sm text-white/70"
                    >
                      Remember me
                    </label>

                  </div>


                  {/* LOGIN BUTTON */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:scale-[1.02] hover:bg-orange-600 active:scale-[0.98]"
                  >
                    Sign In →
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
"use client";

import { useState } from "react";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    ).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Account created successfully! Welcome to Go-Bharat 🇮🇳");
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed text-white"
      style={{ backgroundImage: "url('/signup-bg.png')" }}
    >
      {/* Dark overlay */}
      <div className="min-h-screen bg-black/55">

        {/* HEADER */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <a
              href="/"
              className="text-3xl font-extrabold tracking-tight"
            >
              <span className="text-white">Go-</span>
              <span className="text-orange-400">Bharat</span>
            </a>

            <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
              <a
                href="/"
                className="transition hover:text-orange-400"
              >
                Home
              </a>

              <a
                href="/places"
                className="transition hover:text-orange-400"
              >
                Places
              </a>

              <a
                href="/hotels"
                className="transition hover:text-orange-400"
              >
                Hotels
              </a>

              <a
                href="/about"
                className="transition hover:text-orange-400"
              >
                About
              </a>

              <a
                href="/login"
                className="rounded-full border border-white/40 px-6 py-2 transition hover:bg-white hover:text-black"
              >
                Login
              </a>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <section className="mx-auto flex min-h-[calc(100vh-85px)] max-w-7xl items-center justify-center px-6 py-12">

          <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">

            {/* LEFT SIDE */}
            <div className="hidden lg:block">

              <p className="mb-4 text-lg font-medium tracking-[0.3em] text-orange-300">
                EXPLORE • EXPERIENCE • BELONG
              </p>

              <h1 className="text-6xl font-black leading-tight">
                India
                <br />
                <span className="text-orange-400">
                  Awaits You
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-xl leading-8 text-white/80">
                Discover incredible places, rich cultures,
                delicious food and unforgettable experiences
                across India.
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

              <div className="rounded-3xl border border-white/20 bg-black/45 p-7 shadow-2xl backdrop-blur-xl sm:p-9">

                <div className="mb-7 text-center">

                  <h2 className="text-3xl font-bold">
                    Create Your Account
                  </h2>

                  <p className="mt-2 text-sm text-white/70">
                    Join Go-Bharat and start exploring incredible India.
                  </p>

                </div>

                {/* GOOGLE BUTTON */}
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 font-semibold text-gray-900 transition hover:scale-[1.01] hover:bg-gray-100"
                >
                  <span className="text-lg font-bold">G</span>
                  Continue with Google
                </button>

                {/* OR */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/20" />
                  <span className="text-sm text-white/50">
                    OR
                  </span>
                  <div className="h-px flex-1 bg-white/20" />
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >

                  {/* NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Full Name
                    </label>

                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/45 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email Address
                    </label>

                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/45 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Password
                    </label>

                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        placeholder="Create a password"
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/45 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>

                    <p className="mt-1 text-xs text-white/50">
                      Use at least 6 characters.
                    </p>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        required
                        minLength={6}
                        placeholder="Confirm your password"
                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white outline-none placeholder:text-white/45 transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
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
                      required
                      className="mt-1 h-4 w-4 accent-orange-500"
                    />

                    <span>
                      I agree to the{" "}
                      <span className="text-orange-400">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-orange-400">
                        Privacy Policy
                      </span>
                      .
                    </span>
                  </label>

                  {/* CREATE ACCOUNT */}
                  <button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-orange-500 px-5 py-3.5 text-lg font-bold shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-400 active:translate-y-0"
                  >
                    Create Account →
                  </button>

                </form>

                {/* LOGIN LINK */}
                <p className="mt-7 text-center text-sm text-white/70">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-orange-400 hover:text-orange-300"
                  >
                    Login
                  </a>
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
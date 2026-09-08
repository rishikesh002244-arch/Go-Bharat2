"use client";

import { useState } from "react";
import Link from "next/link";

export default function PlanTrip() {
  const [tripType, setTripType] = useState("Solo");
  const [budget, setBudget] = useState("Moderate");
  const [interests, setInterests] = useState<string[]>([]);

  const interestOptions = [
    "🏛️ Heritage",
    "🏔️ Nature",
    "🏖️ Beaches",
    "🍛 Food",
    "🛕 Spiritual",
    "🎉 Culture",
    "🏕️ Adventure",
    "🛍️ Shopping",
  ];

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    alert(
      `✨ Trip request created!\n\nDestination: ${
        (document.getElementById("destination") as HTMLInputElement)?.value
      }\nTrip Type: ${tripType}\nBudget: ${budget}\nInterests: ${
        interests.length > 0 ? interests.join(", ") : "Not selected"
      }`
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 text-gray-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-xl shadow-lg">
              🇮🇳
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                Go<span className="text-orange-600">-Bharat</span>
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                Explore • Experience • Enjoy
              </p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="font-medium text-gray-600 transition hover:text-orange-600"
            >
              Home
            </Link>

            <Link
              href="/places"
              className="font-medium text-gray-600 transition hover:text-orange-600"
            >
              Places
            </Link>

            <Link
              href="/plan-trip"
              className="font-semibold text-orange-600"
            >
              Plan Trip
            </Link>

            <Link
              href="/hotels"
              className="font-medium text-gray-600 transition hover:text-orange-600"
            >
              Hotels
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-orange-500 px-5 py-2 font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Login
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2 font-semibold text-white shadow-md transition hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-red-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-sm font-semibold text-orange-700">
            ✨ AI-Powered Travel Planning
          </div>

          <h2 className="mx-auto max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Plan Your Perfect
            <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Indian Journey 🇮🇳
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Tell us what you love, where you want to go and your budget.
            Go-Bharat will create a personalized travel experience for you.
          </p>
        </div>
      </section>

      {/* MAIN FORM */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-orange-100 backdrop-blur-xl md:p-10"
        >
          {/* DESTINATION */}
          <div className="mb-8">
            <label
              htmlFor="destination"
              className="mb-3 block text-lg font-bold"
            >
              📍 Where do you want to go?
            </label>

            <input
              id="destination"
              type="text"
              required
              placeholder="Enter a destination — e.g. Goa, Kashmir, Jaipur..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-base outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* FROM + DATES */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="from"
                className="mb-2 block font-semibold text-gray-800"
              >
                🏠 Starting From
              </label>

              <input
                id="from"
                type="text"
                required
                placeholder="Hyderabad"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="start-date"
                className="mb-2 block font-semibold text-gray-800"
              >
                📅 Start Date
              </label>

              <input
                id="start-date"
                type="date"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="mb-2 block font-semibold text-gray-800"
              >
                📅 End Date
              </label>

              <input
                id="end-date"
                type="date"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          {/* TRAVELERS */}
          <div className="mb-8">
            <p className="mb-3 font-bold">👥 Who are you travelling with?</p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {["Solo", "Couple", "Family", "Friends"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`rounded-xl border px-4 py-4 font-semibold transition ${
                    tripType === type
                      ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  {type === "Solo" && "🧑 "}
                  {type === "Couple" && "💑 "}
                  {type === "Family" && "👨‍👩‍👧 "}
                  {type === "Friends" && "🧑‍🤝‍🧑 "}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* BUDGET */}
          <div className="mb-8">
            <p className="mb-3 font-bold">💰 What's your travel budget?</p>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["Budget", "₹5,000 – ₹15,000"],
                ["Moderate", "₹15,000 – ₹40,000"],
                ["Luxury", "₹40,000+"],
              ].map(([name, amount]) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setBudget(name)}
                  className={`rounded-xl border p-4 text-left transition ${
                    budget === name
                      ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                      : "border-gray-200 bg-gray-50 hover:border-orange-300"
                  }`}
                >
                  <p className="font-bold">{name}</p>
                  <p className="mt-1 text-sm text-gray-500">{amount}</p>
                </button>
              ))}
            </div>
          </div>

          {/* INTERESTS */}
          <div className="mb-8">
            <p className="mb-3 font-bold">
              ❤️ What are you interested in?
            </p>

            <p className="mb-4 text-sm text-gray-500">
              Select as many as you want.
            </p>

            <div className="flex flex-wrap gap-3">
              {interestOptions.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                    interests.includes(interest)
                      ? "border-orange-500 bg-orange-500 text-white shadow-md"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-orange-300 hover:bg-orange-50"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* TRANSPORT */}
          <div className="mb-10">
            <label
              htmlFor="transport"
              className="mb-3 block font-bold"
            >
              🚗 Preferred Transport
            </label>

            <select
              id="transport"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
            >
              <option>Any / Let AI decide</option>
              <option>Flight ✈️</option>
              <option>Train 🚆</option>
              <option>Bus 🚌</option>
              <option>Car 🚗</option>
            </select>
          </div>

          {/* AI BUTTON */}
          <button
            type="submit"
            className="group w-full rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 px-6 py-5 text-lg font-extrabold text-white shadow-xl shadow-orange-200 transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <span className="mr-2 inline-block transition group-hover:rotate-12">
              ✨
            </span>
            Generate My AI Trip
            <span className="ml-2">→</span>
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            🤖 Your personalized itinerary will be generated using AI
          </p>
        </form>
      </section>

      {/* FEATURES */}
      <section className="border-t border-orange-100 bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <p className="font-semibold text-orange-600">
              WHY GO-BHARAT?
            </p>

            <h3 className="mt-2 text-3xl font-black">
              Your entire trip, intelligently planned
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">
              <div className="mb-4 text-4xl">🤖</div>
              <h4 className="text-xl font-bold">AI Itinerary</h4>
              <p className="mt-2 leading-7 text-gray-600">
                Get a personalized day-by-day travel plan based on your
                interests and budget.
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
              <div className="mb-4 text-4xl">💰</div>
              <h4 className="text-xl font-bold">Smart Budget</h4>
              <p className="mt-2 leading-7 text-gray-600">
                Plan your expenses for transport, hotels, food and
                activities.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">
              <div className="mb-4 text-4xl">🗺️</div>
              <h4 className="text-xl font-bold">Discover India</h4>
              <p className="mt-2 leading-7 text-gray-600">
                Discover hidden gems and famous destinations across
                incredible India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 px-6 py-8 text-center text-gray-400">
        <p className="font-semibold text-white">
          🇮🇳 Go-Bharat
        </p>

        <p className="mt-2 text-sm">
          Explore India. Experience India. Love India.
        </p>

        <p className="mt-4 text-xs text-gray-500">
          © 2026 Go-Bharat. Built for Smart India Hackathon.
        </p>
      </footer>
    </main>
  );
}
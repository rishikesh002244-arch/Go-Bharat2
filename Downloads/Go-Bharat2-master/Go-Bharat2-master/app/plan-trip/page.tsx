"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import GrokAssistantModal from "@/components/GrokAssistantModal";
import OfflineItinerarySnapshot from "@/components/sih-features/OfflineItinerarySnapshot";

type TripDay = {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  food: string;
  estimatedCost: string;
};

type TripResult = {
  tripTitle: string;
  destination: string;
  summary: string;
  estimatedBudget: {
    total: string;
    stay: string;
    food: string;
    transport: string;
    activities: string;
  };
  days: TripDay[];
  travelTips: string[];
};

export default function PlanTrip() {
  const [tripType, setTripType] = useState("Solo");
  const [budget, setBudget] = useState("Moderate");
  const [interests, setInterests] = useState<string[]>([]);
  const [transport, setTransport] = useState("Any / Let AI decide");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tripResult, setTripResult] = useState<TripResult | null>(null);

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

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end.getTime() - start.getTime();

    return Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Generate button clicked");

    setError("");
    setTripResult(null);

    const formData = new FormData(e.currentTarget);

    const destination = formData.get("destination")?.toString().trim();
    const startingFrom = formData.get("from")?.toString().trim();
    const startDate = formData.get("start-date")?.toString();
    const endDate = formData.get("end-date")?.toString();

    console.log("Form data:", {
      destination,
      startingFrom,
      startDate,
      endDate,
      tripType,
      budget,
      interests,
      transport,
    });

    if (!destination || !startingFrom || !startDate || !endDate) {
      setError("Please fill in all required fields.");
      return;
    }

    const days = calculateDays(startDate, endDate);

    if (days <= 0) {
      setError("End date must be after the start date.");
      return;
    }

    if (days > 30) {
      setError("Please select a trip of 30 days or less.");
      return;
    }

    setLoading(true);

    try {
      console.log("Calling /api/generate-trip...");

      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          startingFrom,
          startDate,
          endDate,
          days,
          travelers: tripType,
          budget,
          interests:
            interests.length > 0
              ? interests.join(", ")
              : "General sightseeing",
          transport,
        }),
      });

      console.log("API response status:", response.status);

      const data = await response.json();

      console.log("API response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate your trip."
        );
      }

      if (!data.itinerary) {
        throw new Error("AI did not return an itinerary.");
      }

      setTripResult(data.itinerary);

      setTimeout(() => {
        document
          .getElementById("trip-result")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 200);
    } catch (err) {
      console.error("Trip generation error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your trip."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 text-gray-900">

      {/* NAVBAR */}
      <Navbar />
      <OfflineItinerarySnapshot currentItinerary={tripResult} />

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
              name="destination"
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
                name="from"
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
                name="start-date"
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
                name="end-date"
                type="date"
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

          </div>

          {/* TRAVELERS */}
          <div className="mb-8">

            <p className="mb-3 font-bold">
              👥 Who are you travelling with?
            </p>

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

            <p className="mb-3 font-bold">
              💰 What's your travel budget?
            </p>

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

                  <p className="font-bold">
                    {name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {amount}
                  </p>

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
              name="transport"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
            >

              <option>
                Any / Let AI decide
              </option>

              <option>
                Flight ✈️
              </option>

              <option>
                Train 🚆
              </option>

              <option>
                Bus 🚌
              </option>

              <option>
                Car 🚗
              </option>

            </select>

          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center font-medium text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* GENERATE BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`group w-full rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 px-6 py-5 text-lg font-extrabold text-white shadow-xl shadow-orange-200 transition ${
              loading
                ? "cursor-not-allowed opacity-70"
                : "hover:-translate-y-1 hover:shadow-2xl"
            }`}
          >

            {loading ? (
              <>
                <span className="mr-2 inline-block animate-spin">
                  ⏳
                </span>

                Creating Your AI Trip...
              </>
            ) : (
              <>
                <span className="mr-2 inline-block transition group-hover:rotate-12">
                  ✨
                </span>

                Generate My AI Trip

                <span className="ml-2">
                  →
                </span>
              </>
            )}

          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            🤖 Your personalized itinerary will be generated using AI
          </p>

        </form>
      </section>

      {/* AI RESULT */}
      {tripResult && (
        <section
          id="trip-result"
          className="mx-auto max-w-6xl px-6 pb-20"
        >

          {/* RESULT HEADER */}
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 p-8 text-white shadow-2xl md:p-10">

            <p className="mb-3 font-semibold uppercase tracking-widest text-orange-100">
              ✨ Your AI-Generated Journey
            </p>

            <h2 className="text-3xl font-black md:text-5xl">
              {tripResult.tripTitle}
            </h2>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-orange-50">
              {tripResult.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <span className="rounded-full bg-white/20 px-4 py-2 font-semibold backdrop-blur">
                📍 {tripResult.destination}
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 font-semibold backdrop-blur">
                📅 {tripResult.days.length} Days
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 font-semibold backdrop-blur">
                👥 {tripType}
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 font-semibold backdrop-blur">
                💰 {budget}
              </span>

            </div>
          </div>

          {/* BUDGET */}
          <div className="mt-10">

            <h3 className="mb-5 text-2xl font-black">
              💰 Estimated Trip Budget
            </h3>

            <div className="grid gap-4 md:grid-cols-5">

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">

                <p className="text-sm font-semibold text-gray-500">
                  Total
                </p>

                <p className="mt-2 text-xl font-black text-orange-600">
                  {tripResult.estimatedBudget.total}
                </p>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm font-semibold text-gray-500">
                  🏨 Stay
                </p>

                <p className="mt-2 font-bold">
                  {tripResult.estimatedBudget.stay}
                </p>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm font-semibold text-gray-500">
                  🍛 Food
                </p>

                <p className="mt-2 font-bold">
                  {tripResult.estimatedBudget.food}
                </p>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm font-semibold text-gray-500">
                  🚗 Transport
                </p>

                <p className="mt-2 font-bold">
                  {tripResult.estimatedBudget.transport}
                </p>

              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm">

                <p className="text-sm font-semibold text-gray-500">
                  🎟️ Activities
                </p>

                <p className="mt-2 font-bold">
                  {tripResult.estimatedBudget.activities}
                </p>

              </div>

            </div>
          </div>

          {/* ITINERARY */}
          <div className="mt-10">

            <h3 className="mb-6 text-2xl font-black">
              🗺️ Your Day-by-Day Itinerary
            </h3>

            <div className="space-y-6">

              {tripResult.days.map((day) => (

                <div
                  key={day.day}
                  className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg"
                >

                  {/* DAY HEADER */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-5">

                    <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">

                      <div>

                        <p className="font-bold text-orange-600">
                          DAY {day.day}
                        </p>

                        <h4 className="text-2xl font-black">
                          {day.title}
                        </h4>

                      </div>

                      <span className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
                        💰 {day.estimatedCost}
                      </span>

                    </div>

                  </div>

                  {/* DAY DETAILS */}
                  <div className="grid gap-5 p-6 md:grid-cols-3">

                    <div className="rounded-2xl bg-orange-50 p-5">

                      <p className="mb-2 font-bold text-orange-700">
                        🌅 Morning
                      </p>

                      <p className="leading-7 text-gray-700">
                        {day.morning}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-red-50 p-5">

                      <p className="mb-2 font-bold text-red-700">
                        ☀️ Afternoon
                      </p>

                      <p className="leading-7 text-gray-700">
                        {day.afternoon}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-orange-50 p-5">

                      <p className="mb-2 font-bold text-orange-700">
                        🌆 Evening
                      </p>

                      <p className="leading-7 text-gray-700">
                        {day.evening}
                      </p>

                    </div>

                  </div>

                  {/* FOOD */}
                  <div className="mx-6 mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">

                    <p className="font-bold">
                      🍛 Food Recommendation
                    </p>

                    <p className="mt-2 leading-7 text-gray-600">
                      {day.food}
                    </p>

                  </div>

                </div>

              ))}

            </div>
          </div>

          {/* TRAVEL TIPS */}
          <div className="mt-10 rounded-3xl border border-orange-100 bg-white p-6 shadow-lg md:p-8">

            <h3 className="text-2xl font-black">
              💡 Smart Travel Tips
            </h3>

            <div className="mt-5 grid gap-3">

              {tripResult.travelTips.map((tip, index) => (

                <div
                  key={index}
                  className="flex gap-3 rounded-xl bg-orange-50 p-4"
                >

                  <span className="font-bold text-orange-600">
                    {index + 1}.
                  </span>

                  <p className="leading-7 text-gray-700">
                    {tip}
                  </p>

                </div>

              ))}

            </div>
          </div>

        </section>
      )}

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

              <div className="mb-4 text-4xl">
                🤖
              </div>

              <h4 className="text-xl font-bold">
                AI Itinerary
              </h4>

              <p className="mt-2 leading-7 text-gray-600">
                Get a personalized day-by-day travel plan based on your
                interests and budget.
              </p>

            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">

              <div className="mb-4 text-4xl">
                💰
              </div>

              <h4 className="text-xl font-bold">
                Smart Budget
              </h4>

              <p className="mt-2 leading-7 text-gray-600">
                Plan your expenses for transport, hotels, food and
                activities.
              </p>

            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-6">

              <div className="mb-4 text-4xl">
                🗺️
              </div>

              <h4 className="text-xl font-bold">
                Discover India
              </h4>

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

      <GrokAssistantModal />
    </main>
  );
}

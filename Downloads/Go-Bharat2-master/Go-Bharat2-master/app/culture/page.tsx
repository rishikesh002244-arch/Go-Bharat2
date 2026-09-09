"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import GrokAssistantModal from "@/components/GrokAssistantModal";
import { CultureItem } from "@/lib/sample-data";

const CULTURE_TYPES = ["All", "Festival", "Dance & Art", "Tradition"];

export default function CulturePage() {
  const [cultures, setCultures] = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCulture = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedType !== "All") params.append("type", selectedType);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/culture?${params.toString()}`);
      const data = await res.json();

      if (!res.ok && !data.data) {
        throw new Error(data.error || "Failed to load cultural traditions");
      }

      setCultures(data.data || []);
    } catch (err: any) {
      console.error("Error fetching culture:", err);
      setError(
        err?.message ||
          "Could not load cultural heritage data. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCulture();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedType, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-orange-50/60 to-transparent px-6 py-12 md:py-16 md:px-12">
        <div className="mx-auto max-w-[1400px] text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#f97316]">
            LIVING TRADITIONS • 5000 YEARS OF HERITAGE
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl text-[#14213d]">
            Vibrant Culture of <span className="text-[#f97316]">Bharat</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 leading-relaxed">
            Immerse yourself in India's soul — vibrant festivals illuminated with millions of diyas, mesmerizing classical dances, and timeless rituals passed down through generations.
          </p>

          {/* SEARCH */}
          <div className="mx-auto mt-8 max-w-3xl flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search traditions, dances, or festivals (e.g. Diwali, Kathakali)..."
                className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* TYPE PILLS */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CULTURE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition shadow-sm ${
                  selectedType === type
                    ? "bg-[#f97316] text-white shadow-orange-500/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CULTURE CARDS GRID */}
      <main className="mx-auto flex-1 max-w-[1400px] w-full px-6 py-8 md:px-12">
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={fetchCulture}
            title="Unable to load cultural traditions"
          />
        ) : cultures.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 text-4xl">🪔</div>
            <h3 className="text-lg font-bold text-gray-800">No cultural traditions found</h3>
            <p className="text-sm text-gray-500">
              Try exploring with a different search term or category.
            </p>
            <button
              onClick={() => {
                setSelectedType("All");
                setSearchQuery("");
              }}
              className="mt-4 text-sm font-semibold text-orange-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {cultures.map((culture, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* IMAGE */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <img
                    src={culture.image}
                    alt={culture.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <span className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {culture.type}
                  </span>

                  <span className="absolute top-4 right-4 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-800 shadow-md">
                    📍 {culture.state}
                  </span>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold tracking-tight">
                      {culture.title}
                    </h3>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {culture.description}
                  </p>

                  <div className="mt-4 space-y-2 rounded-2xl bg-orange-50/60 p-3.5 text-xs">
                    <div>
                      <span className="font-bold text-gray-800">Season / Timing: </span>
                      <span className="text-gray-600">{culture.season}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800">Significance: </span>
                      <span className="text-gray-600">{culture.significance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <GrokAssistantModal />
      <Footer />
    </div>
  );
}

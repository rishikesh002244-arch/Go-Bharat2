"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import GrokAssistantModal from "@/components/GrokAssistantModal";
import CrowdDensityBadge from "@/components/sih-features/CrowdDensityBadge";
import MockTicketQRCode from "@/components/sih-features/MockTicketQRCode";
import { PlaceItem } from "@/lib/sample-data";

const CATEGORIES = ["All", "Heritage", "Nature", "Beach", "Spiritual", "Adventure"];

export default function PlacesPage() {
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  const fetchPlaces = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/places?${params.toString()}`);
      const data = await res.json();

      if (!res.ok && !data.data) {
        throw new Error(data.error || "Failed to load places");
      }

      setPlaces(data.data || []);
    } catch (err: any) {
      console.error("Error fetching places:", err);
      setError(
        err?.message ||
          "Could not load places. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlaces();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-orange-50/60 to-transparent px-6 py-12 md:py-16 md:px-12">
        <div className="mx-auto max-w-[1400px] text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#f97316]">
            ICONIC DESTINATIONS • 28 STATES & 8 UTs
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl text-[#14213d]">
            Discover Majestic Places of <span className="text-[#f97316]">Bharat</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 leading-relaxed">
            From the snow-capped Himalayan peaks of Ladakh to the tranquil backwaters of Kerala and ancient temple corridors.
          </p>

          {/* SEARCH & FILTERS BAR */}
          <div className="mx-auto mt-8 max-w-3xl flex flex-col gap-4 sm:flex-row items-center">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by monument, city, or state (e.g., Taj Mahal, Goa)..."
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

          {/* CATEGORY PILLS */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition shadow-sm ${
                  selectedCategory === cat
                    ? "bg-[#f97316] text-white shadow-orange-500/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PLACES GRID */}
      <main className="mx-auto flex-1 max-w-[1400px] w-full px-6 py-8 md:px-12">
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={fetchPlaces}
            title="Unable to load destinations"
          />
        ) : places.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 text-4xl">📍</div>
            <h3 className="text-lg font-bold text-gray-800">No destinations found</h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search query or selecting another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 text-sm font-semibold text-orange-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {places.map((place, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* IMAGE */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <span className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {place.category}
                  </span>

                  <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-800 shadow-md">
                    <span className="text-yellow-500">★</span> {place.rating}
                  </span>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-xs font-medium text-orange-200">
                      {place.state}, {place.region} India
                    </p>
                    <h3 className="text-xl font-bold tracking-tight">
                      {place.name}
                    </h3>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="line-clamp-3 text-sm text-gray-600 leading-relaxed">
                    {place.description}
                  </p>

                  <div className="mt-3">
                    <CrowdDensityBadge
                      locationId={place.name
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]+/g, "-")
                        .replace(/^-+|-+$/g, "")}
                    />
                  </div>

                  {/* HIGHLIGHTS */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {place.highlights?.slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-800"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>

                  {/* METADATA FOOTER */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div>
                      <p className="font-semibold text-gray-800">Best Season</p>
                      <p className="truncate max-w-[140px]">{place.bestTimeToVisit}</p>
                    </div>

                    <button
                      onClick={() => setSelectedPlace(place)}
                      className="rounded-xl bg-gray-100 px-4 py-2 font-bold text-gray-800 transition hover:bg-orange-500 hover:text-white"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* DETAIL MODAL */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700 hover:bg-gray-200"
            >
              ✕
            </button>

            <div className="h-64 w-full overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                  {selectedPlace.category} • {selectedPlace.state}
                </span>
                <span className="font-bold text-sm text-gray-700">
                  ★ {selectedPlace.rating} / 5.0
                </span>
              </div>

              <h2 className="mt-2 text-3xl font-black text-gray-900">
                {selectedPlace.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {selectedPlace.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
                  <p className="font-bold text-gray-800">🕒 Timings</p>
                  <p className="mt-1 text-gray-600">{selectedPlace.timings}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
                  <p className="font-bold text-gray-800">🎟️ Entry Fee</p>
                  <p className="mt-1 text-gray-600">{selectedPlace.entryFee}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
                  <p className="font-bold text-gray-800">☀️ Best Time to Visit</p>
                  <p className="mt-1 text-gray-600">{selectedPlace.bestTimeToVisit}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3.5">
                  <p className="font-bold text-gray-800">✨ Key Highlights</p>
                  <p className="mt-1 text-gray-600">{selectedPlace.highlights?.join(", ")}</p>
                </div>
              </div>

              <MockTicketQRCode
                placeId={selectedPlace.name
                  .toLowerCase()
                  .replace(/[^a-z0-9_-]+/g, "-")
                  .replace(/^-+|-+$/g, "")}
                placeName={selectedPlace.name}
              />
            </div>
          </div>
        </div>
      )}

      {/* GROK AI FLOATING WIDGET */}
      <GrokAssistantModal />

      <Footer />
    </div>
  );
}

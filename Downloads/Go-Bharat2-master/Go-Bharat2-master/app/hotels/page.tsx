"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import GrokAssistantModal from "@/components/GrokAssistantModal";
import { HotelItem } from "@/lib/sample-data";

const BUDGET_TIERS = ["All", "Budget", "Moderate", "Luxury"];

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHotels = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedBudget !== "All") params.append("budget", selectedBudget);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/hotels?${params.toString()}`);
      const data = await res.json();

      if (!res.ok && !data.data) {
        throw new Error(data.error || "Failed to load hotels");
      }

      setHotels(data.data || []);
    } catch (err: any) {
      console.error("Error fetching hotels:", err);
      setError(
        err?.message ||
          "Could not load hotel stays. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHotels();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedBudget, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-orange-50/60 to-transparent px-6 py-12 md:py-16 md:px-12">
        <div className="mx-auto max-w-[1400px] text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#f97316]">
            ROYAL PALACES • HERITAGE HAVELIS • BACKWATER RESORTS
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl text-[#14213d]">
            Handpicked Stays in <span className="text-[#f97316]">India</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 leading-relaxed">
            From regal floating palaces in Udaipur to authentic coastal huts in Goa and backpacker hostels in Rishikesh.
          </p>

          {/* SEARCH & FILTERS */}
          <div className="mx-auto mt-8 max-w-3xl flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city or hotel (e.g. Udaipur, Kerala, Zostel)..."
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

          {/* BUDGET FILTER BUTTONS */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {BUDGET_TIERS.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedBudget(tier)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition shadow-sm ${
                  selectedBudget === tier
                    ? "bg-[#f97316] text-white shadow-orange-500/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {tier === "All" ? "All Stays" : `${tier} Stays`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOTELS GRID */}
      <main className="mx-auto flex-1 max-w-[1400px] w-full px-6 py-8 md:px-12">
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={fetchHotels}
            title="Unable to load hotels"
          />
        ) : hotels.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 text-4xl">🏨</div>
            <h3 className="text-lg font-bold text-gray-800">No hotels found</h3>
            <p className="text-sm text-gray-500">
              Try modifying your search or choosing a different budget category.
            </p>
            <button
              onClick={() => {
                setSelectedBudget("All");
                setSearchQuery("");
              }}
              className="mt-4 text-sm font-semibold text-orange-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* HOTEL IMAGE */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <span className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {hotel.budgetTier}
                  </span>

                  <span className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-800 shadow-md">
                    <span className="text-yellow-500">★</span> {hotel.rating} ({hotel.reviewsCount})
                  </span>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-xs font-medium text-orange-200">
                      📍 {hotel.destination}, {hotel.state}
                    </p>
                    <h3 className="text-xl font-bold tracking-tight">
                      {hotel.name}
                    </h3>
                  </div>
                </div>

                {/* HOTEL DETAILS */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs text-gray-500">{hotel.address}</p>

                  {/* AMENITIES */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {hotel.amenities?.map((amenity, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  {/* PRICE & ACTION */}
                  <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-gray-900">
                        ₹{hotel.pricePerNight.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-gray-500"> / night</span>
                    </div>

                    <button
                      onClick={() =>
                        alert(
                          `Inquiry received for ${hotel.name}! Live reservation system is integrated in booking view.`
                        )
                      }
                      className="rounded-xl bg-[#f97316] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#ea580c] active:scale-95"
                    >
                      Check Rates
                    </button>
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

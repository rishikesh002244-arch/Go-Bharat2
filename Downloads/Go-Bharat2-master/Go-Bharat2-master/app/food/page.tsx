"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorMessage from "@/components/ErrorMessage";
import GrokAssistantModal from "@/components/GrokAssistantModal";
import { FoodItem } from "@/lib/sample-data";

const FOOD_TYPES = ["All", "Vegetarian", "Non-Vegetarian", "Street Food", "Dessert"];
const REGIONS = ["All", "North", "South", "East", "West"];

export default function FoodPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchFood = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (selectedType !== "All") params.append("type", selectedType);
      if (selectedRegion !== "All") params.append("region", selectedRegion);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/food?${params.toString()}`);
      const data = await res.json();

      if (!res.ok && !data.data) {
        throw new Error(data.error || "Failed to load culinary specialties");
      }

      setFoods(data.data || []);
    } catch (err: any) {
      console.error("Error fetching foods:", err);
      setError(
        err?.message ||
          "Could not load food catalog. Please check your network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFood();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedType, selectedRegion, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-orange-50/60 to-transparent px-6 py-12 md:py-16 md:px-12">
        <div className="mx-auto max-w-[1400px] text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-[#f97316]">
            AUTHENTIC FLAVORS • THALIS • STREET DELICACIES
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl text-[#14213d]">
            Culinary Odyssey of <span className="text-[#f97316]">India</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 leading-relaxed">
            Taste centuries of culinary tradition — from aromatic Hyderabadi Dum Biryani to crispy Amritsari Kulchas and velvety Bengali Rosogollas.
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
                placeholder="Search dish, state, or spice (e.g. Biryani, Dosa, Punjab)..."
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

          {/* DIETARY PILLS */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {FOOD_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition shadow-sm ${
                  selectedType === type
                    ? "bg-[#f97316] text-white shadow-orange-500/20"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* REGIONAL TABS */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-gray-500">
            <span>Regions:</span>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  selectedRegion === r
                    ? "text-[#f97316] bg-orange-100"
                    : "hover:text-gray-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FOOD CARDS GRID */}
      <main className="mx-auto flex-1 max-w-[1400px] w-full px-6 py-8 md:px-12">
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={fetchFood}
            title="Unable to load food items"
          />
        ) : foods.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-3 text-4xl">🍛</div>
            <h3 className="text-lg font-bold text-gray-800">No dishes found</h3>
            <p className="text-sm text-gray-500">
              Try selecting different dietary preferences or resetting filters.
            </p>
            <button
              onClick={() => {
                setSelectedType("All");
                setSelectedRegion("All");
                setSearchQuery("");
              }}
              className="mt-4 text-sm font-semibold text-orange-600 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {foods.map((food, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                {/* IMAGE */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  <span
                    className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md ${
                      food.type === "Vegetarian"
                        ? "bg-emerald-600/90"
                        : food.type === "Non-Vegetarian"
                        ? "bg-rose-600/90"
                        : "bg-amber-600/90"
                    }`}
                  >
                    {food.type}
                  </span>

                  <span className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {food.region} India
                  </span>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-xs font-medium text-orange-200">
                      📍 {food.state}
                    </p>
                    <h3 className="text-xl font-bold tracking-tight">
                      {food.name}
                    </h3>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {food.description}
                  </p>

                  <div className="mt-4 space-y-2 rounded-2xl bg-orange-50/60 p-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Famous in:</span>
                      <span className="font-bold text-gray-800">{food.famousIn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Flavor profile:</span>
                      <span className="font-semibold text-orange-800">{food.flavorProfile}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      {food.priceRange}
                    </span>
                    <span className="text-xs text-gray-400">Approx. price</span>
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

"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LOCATIONS } from "@/lib/locations";

export default function LocationsIndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-12 md:px-12">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f97316]">
          Explore by Place
        </p>
        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          Choose a Location
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Open a destination hub for places, hotels, food, culture, verified
          guides, and local safety tips.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.slug}
              href={`/location/${loc.slug}`}
              className="group relative h-64 overflow-hidden rounded-3xl shadow-md"
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h2 className="text-2xl font-black">{loc.name}</h2>
                <p className="text-sm text-white/80">{loc.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

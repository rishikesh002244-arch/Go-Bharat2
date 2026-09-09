"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200/80 bg-white pt-14 pb-8 text-gray-600">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* BRAND */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-[#14213d]">
                Go<span className="text-[#f97316]">-Bharat</span>
              </span>
              <span className="text-base">🇮🇳</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empowering travelers to discover the timeless beauty, rich cultures,
              and soul of India through intelligent itinerary planning.
            </p>
            <div className="flex gap-3 text-sm">
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
                Incredible India
              </span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#14213d]">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/places" className="hover:text-[#f97316] transition">
                  Top Destinations
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="hover:text-[#f97316] transition">
                  Heritage & Luxury Stays
                </Link>
              </li>
              <li>
                <Link href="/food" className="hover:text-[#f97316] transition">
                  Regional Cuisines
                </Link>
              </li>
              <li>
                <Link href="/culture" className="hover:text-[#f97316] transition">
                  Festivals & Traditions
                </Link>
              </li>
            </ul>
          </div>

          {/* TRIP PLANNER */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#14213d]">
              AI Tools
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/plan-trip" className="hover:text-[#f97316] transition">
                  AI Trip Generator
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#f97316] transition">
                  About Mission
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#f97316] transition">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#f97316] transition">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT & NEWSLETTER */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#14213d]">
              Stay Inspired
            </h4>
            <p className="mt-4 text-sm text-gray-500">
              Discover weekly travel stories from the Himalayas to Kanyakumari.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs outline-none focus:border-orange-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => alert("Thank you for subscribing to Go-Bharat stories!")}
                className="rounded-xl bg-[#f97316] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#ea580c]"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-12 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          <p>© 2026 Go-Bharat. Crafted with ❤️ for India 🇮🇳 • All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

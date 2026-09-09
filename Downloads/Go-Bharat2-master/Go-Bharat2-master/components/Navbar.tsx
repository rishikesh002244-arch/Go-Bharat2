"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LanguageToggle from "@/components/sih-features/LanguageToggle";
import { useSIHLanguage } from "@/components/sih-features/LanguageProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { t } = useSIHLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home", "Home") },
    { href: "/location", label: t("locations", "Locations") },
    { href: "/places", label: t("places", "Places") },
    { href: "/hotels", label: "Hotels" },
    { href: "/food", label: "Food" },
    { href: "/culture", label: "Culture" },
    { href: "/marketplace", label: t("marketplace", "Marketplace") },
    { href: "/passport", label: t("passport", "Passport") },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-2 md:px-8">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between rounded-full border border-gray-200/70 bg-white/95 px-6 py-3.5 shadow-md backdrop-blur-md">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-black tracking-tight text-[#14213d]">
            Go<span className="text-[#f97316]">-Bharat</span>
          </span>
          <span className="text-base">🇮🇳</span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition ${
                  isActive
                    ? "border-b-2 border-[#f97316] pb-0.5 text-[#f97316]"
                    : "text-gray-600 hover:text-[#f97316]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <Link
            href="/plan-trip"
            className="flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-50 px-4 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-100"
          >
            <span>✨</span>
            <span>{t("planTrip", "Plan Trip")}</span>
          </Link>

          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-gray-200" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1.5 pr-3 transition hover:border-orange-300"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
              {user.role === "admin" && (
                <Link
                  href="/admin/guides"
                  className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-red-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-[#f97316] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#ea580c] active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg md:hidden"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 max-w-[1400px] rounded-3xl border border-gray-200 bg-white p-6 shadow-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold ${
                  pathname === link.href ? "text-[#f97316]" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/plan-trip"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-50 py-3 text-sm font-bold text-orange-600"
            >
              ✨ {t("planTrip", "Plan AI Trip")}
            </Link>

            <LanguageToggle />

            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f97316] text-xs font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold">{user.name}</span>
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin/guides"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold text-purple-700"
                    >
                      Admin · Guides
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-xl bg-[#f97316] py-3 text-center text-sm font-bold text-white"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

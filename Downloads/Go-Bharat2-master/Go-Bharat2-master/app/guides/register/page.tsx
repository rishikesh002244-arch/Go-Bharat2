"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LOCATIONS } from "@/lib/locations";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10";

export default function GuideRegisterPage() {
  const [form, setForm] = useState({
    name: "",
    location: "goa",
    languages: "Hindi, English",
    govtLicenseId: "",
    contact: "",
    bio: "",
    experienceYears: "3",
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/guides/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          location: form.location,
          experienceYears: Number(form.experienceYears) || 1,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Registration failed.");
      } else {
        setSuccess(
          data.message ||
            "Application submitted. An admin will verify your license."
        );
        setForm({
          name: "",
          location: "goa",
          languages: "Hindi, English",
          govtLicenseId: "",
          contact: "",
          bio: "",
          experienceYears: "3",
          profileImage: "",
        });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f97316]">
          Guide Verification
        </p>
        <h1 className="mt-2 text-4xl font-black">Register as a Local Guide</h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Submit your Ministry of Tourism / state guide license for review. We
          validate ID format automatically; an admin confirms documents and marks
          you as verified.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Full Name
            </span>
            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              placeholder="Your full name"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Primary Location
            </span>
            <select
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className={inputClass}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.slug} value={loc.slug}>
                  {loc.name} ({loc.state})
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Government License / Guide ID
            </span>
            <input
              required
              value={form.govtLicenseId}
              onChange={(e) => update("govtLicenseId", e.target.value)}
              className={inputClass}
              placeholder="e.g. MOT-HP-2024-1234"
            />
            <p className="mt-1 text-xs text-gray-500">
              Alphanumeric, 6–24 characters. Format is checked automatically;
              final verification is done by an admin.
            </p>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Languages (comma-separated)
            </span>
            <input
              value={form.languages}
              onChange={(e) => update("languages", e.target.value)}
              className={inputClass}
              placeholder="Hindi, English, Local dialect"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Contact (email or phone)
            </span>
            <input
              required
              value={form.contact}
              onChange={(e) => update("contact", e.target.value)}
              className={inputClass}
              placeholder="you@email.com or +91..."
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Years of Experience
            </span>
            <input
              type="number"
              min={0}
              max={50}
              value={form.experienceYears}
              onChange={(e) => update("experienceYears", e.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500">
              Short Bio
            </span>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Tell travelers about your expertise..."
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#f97316] py-3.5 text-sm font-bold text-white transition hover:bg-[#ea580c] disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Admins review applications at{" "}
          <Link href="/admin/guides" className="font-semibold text-[#f97316]">
            /admin/guides
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About Us | Go-Bharat - Celebrating Incredible India 🇮🇳",
  description:
    "Learn about Go-Bharat's mission to connect travelers with the authentic soul, heritage, culinary diversity, and living traditions of India.",
};

export default function AboutPage() {
  const stats = [
    { label: "States & Territories", value: "28 + 8", icon: "🗺️" },
    { label: "Curated Destinations", value: "1,000+", icon: "📍" },
    { label: "Living Traditions", value: "500+", icon: "🪔" },
    { label: "Authentic Cuisines", value: "100+", icon: "🍛" },
  ];

  const pillars = [
    {
      icon: "🏛️",
      title: "Cultural Heritage Preservation",
      description:
        "India is not just a destination; it is a 5,000-year-old living civilization. We spotlight lesser-known monuments, classical arts, and sacred traditions to sustain local heritage.",
    },
    {
      icon: "🤖",
      title: "Next-Gen AI Travel Intelligence",
      description:
        "By fusing advanced generative AI with deep geographic knowledge of India, we craft practical, culturally aware itineraries tailored to your unique interests and budget.",
    },
    {
      icon: "🌿",
      title: "Responsible & Sustainable Tourism",
      description:
        "We champion community-based homestays, local craft artisans, eco-friendly transport, and low-impact exploration across sensitive Himalayan and coastal ecosystems.",
    },
    {
      icon: "🍛",
      title: "Authentic Culinary Discovery",
      description:
        "From sizzling regional chaats in ancient galiyan to traditional royal feasts, we guide you directly to authentic flavors without tourist traps.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#14213d]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-transparent px-6 pt-16 pb-20 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-[#f97316]">
            OUR MISSION • THE SOUL OF BHARAT
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl text-[#14213d] leading-tight">
            Connecting Travelers with the Spirit of <span className="text-[#f97316]">Incredible India</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Go-Bharat was born from a simple yet profound desire: to make exploring the world's most diverse subcontinent effortless, respectful, and breathtakingly authentic for every traveler.
          </p>
        </div>

        {/* IMPACT METRICS */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-3xl border border-gray-200/80 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{stat.icon}</div>
                <div className="text-3xl font-black text-[#14213d]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY & PHILOSOPHY */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f97316]">
              OUR PHILOSOPHY
            </p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl text-[#14213d]">
              One Subcontinent.
              <br />
              A Million Unforgettable Journeys.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-600">
              India is a land of sensory wonder — where morning temple bells in Varanasi harmonize with azan across old Delhi, where golden sand dunes meet snow-capped Himalayan peaks, and where every state presents a distinct dialect, culinary tapestry, and architectural legacy.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Traditional travel portals treat India as a generic checklist. Go-Bharat elevates your travel by embedding authentic cultural context, safety tips, verified local heritage insights, and smart AI planning that respects both your time and the communities you visit.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/places"
                className="rounded-2xl bg-[#f97316] px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#ea580c] active:scale-95"
              >
                Explore Destinations →
              </Link>
              <Link
                href="/plan-trip"
                className="rounded-2xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition hover:border-[#f97316] hover:text-[#f97316]"
              >
                Plan Custom Trip
              </Link>
            </div>
          </div>

          {/* VISUAL SHOWCASE */}
          <div className="relative">
            <div className="relative h-96 w-full overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85"
                alt="Rajasthan Palace India"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-semibold text-orange-300 uppercase tracking-widest">
                  Atithi Devo Bhava
                </p>
                <p className="text-xl font-bold">
                  "The guest is truly the manifestation of God."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="bg-white py-20 px-6 md:px-12 border-t border-gray-100">
        <div className="mx-auto max-w-[1400px]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f97316]">
              OUR FOUNDATION
            </p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl text-[#14213d]">
              The Core Pillars of Go-Bharat
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Built with purpose, powered by modern technology, driven by love for India.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-gray-200/80 bg-[#fafafa] p-7 transition hover:-translate-y-1.5 hover:shadow-lg hover:border-orange-200"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl mb-5">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-10 md:p-16 text-center text-white shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-100 mb-3">
            YOUR JOURNEY STARTS HERE
          </p>
          <h2 className="text-3xl font-black md:text-5xl">
            Ready to Experience Incredible Bharat?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-orange-100 leading-relaxed">
            Create an account, tell our AI your budget and travel preferences, and receive a customized day-by-day itinerary in seconds.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-full bg-white px-8 py-4 font-bold text-gray-900 shadow-lg transition hover:bg-gray-100 hover:scale-105 active:scale-95"
            >
              Get Started for Free →
            </Link>
            <Link
              href="/places"
              className="rounded-full border border-white/40 bg-black/10 px-8 py-4 font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Browse Places
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

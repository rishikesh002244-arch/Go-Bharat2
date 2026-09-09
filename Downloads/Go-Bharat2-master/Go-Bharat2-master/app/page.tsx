"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import GrokAssistantModal from "@/components/GrokAssistantModal";

const destinations = [
  {
    name: "Kashmir",
    slug: "kashmir",
    subtitle: "Heaven on Earth",
    image:
      "https://images.unsplash.com/photo-1566837497312-7be4c3f7a0d1?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Goa",
    slug: "goa",
    subtitle: "Sun, Sand & Sea",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Rajasthan",
    slug: "rajasthan",
    subtitle: "Royal Heritage",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Kerala",
    slug: "kerala",
    subtitle: "God's Own Country",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Varanasi",
    slug: "varanasi",
    subtitle: "Spiritual Bliss",
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = [
  { icon: "🌴", name: "Beaches" },
  { icon: "🏔️", name: "Mountains" },
  { icon: "🛕", name: "Temples" },
  { icon: "🏰", name: "Heritage" },
  { icon: "🐅", name: "Wildlife" },
  { icon: "🌲", name: "Hill Stations" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#14213d]">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[720px] overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2200&q=90')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/65 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1400px] items-center px-6 pt-24 md:px-12">

          <div className="max-w-2xl">

            <p className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-[#f97316]">
              INDIA AWAITS YOU
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Explore
              <br />
              Incredible India
              <span className="ml-3">🇮🇳</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-700">
              Discover breathtaking destinations, rich cultures,
              delicious food and unforgettable experiences across
              every corner of India.
            </p>

            {/* SEARCH BOX */}
            <div className="mt-9 flex max-w-4xl flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-2xl md:flex-row md:items-center">

              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <span className="text-2xl">📍</span>

                <div>
                  <p className="text-sm font-bold">Where to go?</p>
                  <p className="text-sm text-gray-400">
                    Search destinations...
                  </p>
                </div>
              </div>

              <div className="hidden h-12 w-px bg-gray-200 md:block" />

              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <span className="text-2xl">📅</span>

                <div>
                  <p className="text-sm font-bold">When?</p>
                  <p className="text-sm text-gray-400">
                    Select dates
                  </p>
                </div>
              </div>

              <div className="hidden h-12 w-px bg-gray-200 md:block" />

              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <span className="text-2xl">👥</span>

                <div>
                  <p className="text-sm font-bold">Travelers</p>
                  <p className="text-sm text-gray-400">
                    2 travelers
                  </p>
                </div>
              </div>

              <Link
                href="/plan-trip"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#f97316] px-8 py-4 font-bold text-white transition hover:bg-[#ea580c]"
              >
                🔍 Search
              </Link>
            </div>

            {/* CATEGORY BUTTONS */}
            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  href="/places"
                  key={category.name}
                  className="rounded-full bg-white/90 px-5 py-3 text-sm font-semibold shadow-md backdrop-blur transition hover:-translate-y-1 hover:bg-white"
                >
                  {category.icon} {category.name}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">

        <div className="mb-8 flex items-end justify-between">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f97316]">
              TOP DESTINATIONS
            </p>

            <h2 className="mt-2 text-4xl font-black md:text-5xl">
              Popular Destinations
            </h2>

            <p className="mt-2 text-gray-500">
              From royal palaces to serene beaches, find your next adventure.
            </p>
          </div>

          <Link
            href="/places"
            className="hidden rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold shadow-sm transition hover:border-[#f97316] hover:text-[#f97316] md:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {destinations.map((destination) => (
            <Link
              href={`/location/${destination.slug}`}
              key={destination.name}
              className="group relative h-72 overflow-hidden rounded-2xl shadow-md"
            >

              <img
                src={destination.image}
                alt={destination.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">

                <h3 className="text-2xl font-black">
                  {destination.name}
                </h3>

                <p className="text-sm text-white/80">
                  {destination.subtitle}
                </p>

              </div>

              <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition group-hover:bg-[#f97316] group-hover:text-white">
                →
              </div>

            </Link>
          ))}

        </div>
      </section>

      {/* WHY GO-BHARAT */}
      <section className="bg-white px-6 py-16 md:px-12">

        <div className="mx-auto max-w-[1400px]">

          <div className="mb-12">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f97316]">
              MORE THAN A JOURNEY
            </p>

            <h2 className="mt-2 text-4xl font-black md:text-5xl">
              Why Choose Go-Bharat?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-4">

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
                🛡️
              </div>

              <h3 className="mt-5 font-bold">
                Verified Information
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Trusted and updated travel information
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-3xl">
                🗺️
              </div>

              <h3 className="mt-5 font-bold">
                Curated Experiences
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Handpicked experiences just for you
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50 text-3xl">
                ✨
              </div>

              <h3 className="mt-5 font-bold">
                Personalized Plans
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                AI-powered travel suggestions
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">
                ❤️
              </div>

              <h3 className="mt-5 font-bold">
                Support Local
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Help local communities grow
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* AI TRIP PLANNER CTA */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-12">

        <div className="relative overflow-hidden rounded-[2rem] bg-[#14213d] px-8 py-14 text-white md:px-16">

          <div className="relative z-10 max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#fb923c]">
              YOUR PERSONAL TRAVEL ASSISTANT
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Not just a trip,
              <br />
              but a story to tell.
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">
              Tell Go-Bharat where you want to go, your budget,
              interests and travel dates. Our AI will create a
              personalized Indian travel itinerary for you.
            </p>

            <Link
              href="/plan-trip"
              className="mt-8 inline-flex rounded-full bg-[#f97316] px-8 py-4 font-bold transition hover:bg-[#ea580c]"
            >
              Plan My Trip ✨
            </Link>

          </div>

          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-32 right-20 h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#101827] px-6 py-12 text-white md:px-12">

        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-4">

          <div>
            <div className="text-2xl font-black">
              Go<span className="text-[#f97316]">-Bharat</span>
            </div>

            <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
              Explore India. Experience India. Belong to India.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Explore</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <Link href="/places" className="block hover:text-orange-400">
                Places
              </Link>

              <Link href="/hotels" className="block hover:text-orange-400">
                Hotels
              </Link>

              <Link href="/food" className="block hover:text-orange-400">
                Food
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Go-Bharat</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <Link href="/about" className="block hover:text-orange-400">
                About Us
              </Link>

              <Link href="/plan-trip" className="block hover:text-orange-400">
                AI Trip Planner
              </Link>

              <Link href="/login" className="block hover:text-orange-400">
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Discover India 🇮🇳</h3>

            <p className="mt-4 text-sm leading-7 text-gray-400">
              Mountains, beaches, heritage, temples, food,
              wildlife and unforgettable experiences.
            </p>
          </div>

        </div>

        <div className="mx-auto mt-10 max-w-[1400px] border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © 2026 Go-Bharat. Made with ❤️ for Incredible India.
        </div>

      </footer>

      <GrokAssistantModal />
    </main>
  );
}
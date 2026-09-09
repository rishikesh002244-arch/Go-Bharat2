export interface LocationInfo {
  slug: string;
  name: string;
  state: string;
  tagline: string;
  searchTerms: string[];
  image: string;
}

export const LOCATIONS: LocationInfo[] = [
  {
    slug: "goa",
    name: "Goa",
    state: "Goa",
    tagline: "Sun, Sand & Sea",
    searchTerms: ["goa"],
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    state: "Rajasthan",
    tagline: "Royal Heritage",
    searchTerms: ["rajasthan", "udaipur", "jaipur"],
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "kerala",
    name: "Kerala",
    state: "Kerala",
    tagline: "God's Own Country",
    searchTerms: ["kerala", "kumarakom"],
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    state: "Ladakh",
    tagline: "Land of High Passes",
    searchTerms: ["ladakh", "leh", "pangong"],
    image:
      "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    tagline: "Spiritual Bliss",
    searchTerms: ["varanasi", "benaras", "uttar pradesh", "taj"],
    image:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "kashmir",
    name: "Kashmir",
    state: "Jammu and Kashmir",
    tagline: "Heaven on Earth",
    searchTerms: ["kashmir", "srinagar", "jammu"],
    image:
      "https://images.unsplash.com/photo-1566837497312-7be4c3f7a0d1?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    tagline: "Valley of the Gods",
    searchTerms: ["manali", "himachal"],
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d6370a76?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    tagline: "City of Pearls",
    searchTerms: ["hyderabad", "telangana"],
    image:
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=85",
  },
];

export function getLocationBySlug(slug: string): LocationInfo | undefined {
  return LOCATIONS.find((loc) => loc.slug === slug.toLowerCase());
}

export function slugifyLocation(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Build a Mongo-friendly $or filter that matches any location search term
 * against the provided fields.
 */
export function buildLocationOrFilter(
  locationParam: string,
  fields: string[]
): Record<string, unknown> | null {
  const loc = getLocationBySlug(locationParam);
  const terms = loc
    ? loc.searchTerms
    : [locationParam.replace(/-/g, " ").trim()].filter(Boolean);

  if (!terms.length || !fields.length) return null;

  const orClauses: Record<string, RegExp>[] = [];
  for (const term of terms) {
    const regex = new RegExp(term, "i");
    for (const field of fields) {
      orClauses.push({ [field]: regex });
    }
  }

  return { $or: orClauses };
}

/**
 * In-memory filter helper for sample/fallback data.
 */
export function matchesLocation(
  locationParam: string | null | undefined,
  values: Array<string | undefined | null>
): boolean {
  if (!locationParam) return true;

  const loc = getLocationBySlug(locationParam);
  const terms = loc
    ? loc.searchTerms
    : [locationParam.replace(/-/g, " ").trim()].filter(Boolean);

  const haystack = values
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return terms.some((term) => haystack.includes(term.toLowerCase()));
}

/**
 * Basic format check for Indian tourism guide license IDs.
 * Accepts patterns like: MOT-HP-2024-1234, GJTG/2023/0456, or alphanumeric 6–24 chars.
 */
export function isValidGuideLicenseFormat(licenseId: string): boolean {
  const cleaned = licenseId.trim().toUpperCase();
  if (cleaned.length < 6 || cleaned.length > 24) return false;
  return /^[A-Z0-9][A-Z0-9\-\/]{4,22}[A-Z0-9]$/.test(cleaned);
}

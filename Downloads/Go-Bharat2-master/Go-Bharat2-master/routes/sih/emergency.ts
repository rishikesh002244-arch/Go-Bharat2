export type SIHCoordinates = {
  latitude: number;
  longitude: number;
};

export type EmergencyFacility = {
  name: string;
  type: "Police station" | "Hospital";
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
};

const MOCK_FACILITIES = [
  {
    name: "Tourist Police Assistance Desk",
    type: "Police station" as const,
    phone: "112",
    address: "Central tourist assistance network",
    latitude: 28.6139,
    longitude: 77.209,
  },
  {
    name: "Government Emergency Hospital",
    type: "Hospital" as const,
    phone: "108",
    address: "State emergency medical network",
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    name: "Women & Tourist Safety Cell",
    type: "Police station" as const,
    phone: "112",
    address: "Regional public safety network",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    name: "District Trauma Care Centre",
    type: "Hospital" as const,
    phone: "108",
    address: "Regional emergency medical network",
    latitude: 22.5726,
    longitude: 88.3639,
  },
];

function kilometresBetween(a: SIHCoordinates, b: SIHCoordinates) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(b.latitude - a.latitude);
  const longitudeDelta = toRadians(b.longitude - a.longitude);
  const latitudeA = toRadians(a.latitude);
  const latitudeB = toRadians(b.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function isValidCoordinates(value: unknown): value is SIHCoordinates {
  if (!value || typeof value !== "object") return false;
  const coordinates = value as Partial<SIHCoordinates>;
  return (
    typeof coordinates.latitude === "number" &&
    Number.isFinite(coordinates.latitude) &&
    coordinates.latitude >= -90 &&
    coordinates.latitude <= 90 &&
    typeof coordinates.longitude === "number" &&
    Number.isFinite(coordinates.longitude) &&
    coordinates.longitude >= -180 &&
    coordinates.longitude <= 180
  );
}

/**
 * Mock-only responder. It never stores coordinates: emergency location data is
 * deliberately handled in memory for this proof of concept.
 */
export function findNearestEmergencyFacilities(coordinates: SIHCoordinates) {
  const facilities = MOCK_FACILITIES.map((facility) => ({
    ...facility,
    distanceKm: Number(
      kilometresBetween(coordinates, facility).toFixed(1)
    ),
  })).sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    coordinates,
    nearestPoliceStation: facilities.find(
      (facility) => facility.type === "Police station"
    ) as EmergencyFacility,
    nearestHospital: facilities.find(
      (facility) => facility.type === "Hospital"
    ) as EmergencyFacility,
    emergencyNumbers: {
      unifiedEmergency: "112",
      ambulance: "108",
      womenHelpline: "181",
      touristHelpline: "1363",
    },
    disclaimer:
      "Mock SIH emergency data. Call 112 or 108 directly for a real emergency.",
  };
}

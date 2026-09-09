export type CrowdDensityLevel = "Low" | "Medium" | "High";

export type CrowdDensity = {
  locationId: string;
  level: CrowdDensityLevel;
  estimatedVisitors: number;
  updatedAt: string;
  suggestion: string;
};

function deterministicValue(locationId: string) {
  // The 20-minute bucket keeps a location stable enough for a useful UI,
  // while still demonstrating a fresh simulated sensor reading over time.
  const bucket = Math.floor(Date.now() / (20 * 60 * 1000));
  let hash = 5381;
  for (const character of `${locationId}:${bucket}`) {
    hash = (hash * 33) ^ character.charCodeAt(0);
  }
  return Math.abs(hash >>> 0);
}

export function getCrowdDensity(locationId: string): CrowdDensity {
  const value = deterministicValue(locationId);
  const levelIndex = value % 3;
  const level: CrowdDensityLevel = ["Low", "Medium", "High"][levelIndex] as CrowdDensityLevel;
  const estimatedVisitors =
    level === "Low"
      ? 40 + (value % 140)
      : level === "Medium"
        ? 220 + (value % 420)
        : 700 + (value % 1300);

  const suggestion =
    level === "Low"
      ? "Great time to visit — short queues expected."
      : level === "Medium"
        ? "Moderate footfall — consider a timed ticket."
        : "Peak footfall — choose an off-peak slot if possible.";

  return {
    locationId,
    level,
    estimatedVisitors,
    updatedAt: new Date().toISOString(),
    suggestion,
  };
}

export type BrowserCoordinates = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

export function getCurrentCoordinates(): Promise<BrowserCoordinates> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return Promise.reject(new Error("Location services are not supported on this device."));
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }),
      (error) => {
        const messages: Record<number, string> = {
          1: "Location permission was denied. You can still call 112 directly.",
          2: "Your location could not be determined. Try again outdoors or call 112.",
          3: "Location request timed out. Try again or call 112.",
        };
        reject(new Error(messages[error.code] || "Unable to access your location."));
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  });
}

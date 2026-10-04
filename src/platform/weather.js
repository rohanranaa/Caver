import * as Location from "expo-location";

async function getJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok)
      throw new Error("Weather is unavailable. Please try again.");
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError")
      throw new Error("Weather request timed out. Try again or choose a city.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
export function weatherCondition(code) {
  if (code === 0) return "Sunny";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
  if (code >= 95) return "Thunderstorms";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "Rainy";
  return "Unknown";
}
export async function searchCities(query) {
  if (query.trim().length < 2)
    throw new Error("Enter at least two characters.");
  const data = await getJson(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`,
  );
  return (data.results || [])
    .filter(
      (city) =>
        Number.isFinite(city.latitude) && Number.isFinite(city.longitude),
    )
    .map((city) => ({
      latitude: city.latitude,
      longitude: city.longitude,
      location: [city.name, city.admin1, city.country]
        .filter(Boolean)
        .join(", "),
    }));
}
export async function fetchWeather(place, mode = "city") {
  const { latitude, longitude } = place;
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  )
    throw new Error("Choose a valid location.");
  const data = await getJson(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(2)}&longitude=${longitude.toFixed(2)}&current=temperature_2m,apparent_temperature,weather_code&timezone=auto`,
  );
  const current = data.current;
  if (
    !Number.isFinite(current?.temperature_2m) ||
    !Number.isFinite(current?.apparent_temperature) ||
    !Number.isInteger(current?.weather_code)
  )
    throw new Error(
      "Weather provider returned incomplete conditions. Please retry.",
    );
  return {
    ...place,
    latitude: Number(latitude.toFixed(2)),
    longitude: Number(longitude.toFixed(2)),
    mode,
    source: "Open-Meteo",
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    condition: weatherCondition(current.weather_code),
    weatherCode: current.weather_code,
    updatedAt: new Date().toISOString(),
  };
}
export async function currentLocationWeather() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted")
    throw new Error(
      "Location access is off. Search for your city below instead.",
    );
  let timer;
  try {
    const position = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(
                "Location took too long. Search for your city instead.",
              ),
            ),
          15000,
        );
      }),
    ]);
    return await fetchWeather(
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        location: "Current location",
      },
      "current",
    );
  } finally {
    clearTimeout(timer);
  }
}

import * as Location from "expo-location";
import {
  weatherCondition,
  searchCities,
  fetchWeather,
  currentLocationWeather,
} from "./weather";
afterEach(() => jest.restoreAllMocks());
test("current weather asks permission and denial provides a city fallback", async () => {
  Location.requestForegroundPermissionsAsync.mockResolvedValue({
    status: "denied",
  });
  await expect(currentLocationWeather()).rejects.toThrow(
    "Search for your city",
  );
  expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
});
test("weather maps snow/storms, rounds coordinates, and handles incomplete provider responses", async () => {
  expect(weatherCondition(75)).toBe("Snowy");
  expect(weatherCondition(95)).toBe("Thunderstorms");
  const fetchMock = jest
    .spyOn(global, "fetch")
    .mockResolvedValue({
      ok: true,
      json: async () => ({
        current: {
          temperature_2m: 16.8,
          apparent_temperature: 15.2,
          weather_code: 61,
        },
      }),
    });
  const result = await fetchWeather({
    latitude: 28.6139,
    longitude: 77.209,
    location: "Delhi",
  });
  expect(result).toMatchObject({
    temperature: 17,
    condition: "Rainy",
    latitude: 28.61,
    source: "Open-Meteo",
    mode: "city",
  });
  expect(fetchMock.mock.calls[0][0]).toContain("latitude=28.61");
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ current: {} }),
  });
  await expect(fetchWeather({ latitude: 1, longitude: 1 })).rejects.toThrow(
    "incomplete",
  );
});
test("city search supports disambiguation and network errors", async () => {
  const mock = jest
    .spyOn(global, "fetch")
    .mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            name: "London",
            admin1: "England",
            country: "United Kingdom",
            latitude: 51.5,
            longitude: -0.1,
          },
        ],
      }),
    });
  expect(await searchCities("London")).toEqual([
    {
      location: "London, England, United Kingdom",
      latitude: 51.5,
      longitude: -0.1,
    },
  ]);
  mock.mockResolvedValue({ ok: false });
  await expect(searchCities("Delhi")).rejects.toThrow("unavailable");
});

import React, { useState } from "react";
import { Text, View } from "react-native";
import { Screen, Heading, Button, Input } from "../stylematch/UI";
import { useStyleStore } from "./store";
import {
  searchCities,
  fetchWeather,
  currentLocationWeather,
} from "../platform/weather";
import { s } from "./theme";
export default function WeatherScreen() {
  const { weather, setWeather } = useStyleStore();
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const run = async (task) => {
    setBusy(true);
    setError("");
    try {
      await task();
    } catch (e) {
      setError(e.message || "Could not update weather.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen>
      <Heading
        eyebrow="DRESS FOR THE DAY"
        title="Your weather, wherever you go."
        subtitle="Allow location access for current conditions, or choose a city. Approximate coordinates are sent to Open-Meteo."
      />
      <View style={s.card}>
        <Text style={s.h2}>
          {weather.temperature}°C · {weather.condition}
        </Text>
        <Text style={s.body}>
          {weather.location} · Feels like {weather.feelsLike}°C
        </Text>
        <Text style={s.small}>
          {weather.source === "Open-Meteo"
            ? `Updated ${new Date(weather.updatedAt).toLocaleString()} · Open-Meteo`
            : "Sample weather — choose a location for live conditions."}
        </Text>
      </View>
      <Button
        title={busy ? "Getting weather…" : "Use my current location"}
        icon="location"
        disabled={busy}
        onPress={() =>
          run(async () => setWeather(await currentLocationWeather()))
        }
      />
      <Input
        label="Search city"
        value={query}
        onChangeText={setQuery}
        placeholder="e.g. Delhi or London"
        maxLength={100}
      />
      <Button
        title="Find city"
        secondary
        disabled={busy}
        onPress={() =>
          run(async () => {
            const results = await searchCities(query);
            setCities(results);
            if (!results.length)
              setError("No cities found. Try another spelling.");
          })
        }
      />
      {cities.map((city) => (
        <Button
          key={`${city.latitude}:${city.longitude}`}
          title={city.location}
          secondary
          disabled={busy}
          onPress={() =>
            run(async () => {
              setWeather(await fetchWeather(city));
              setCities([]);
            })
          }
        />
      ))}
      {weather.source === "Open-Meteo" && (
        <Button
          title="Refresh selected location"
          secondary
          disabled={busy}
          onPress={() =>
            run(async () =>
              setWeather(
                weather.mode === "current"
                  ? await currentLocationWeather()
                  : await fetchWeather(weather),
              ),
            )
          }
        />
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <Text style={s.small}>
        Selected cities stay selected until you use your current location again.
        Weather data: Open-Meteo, CC BY 4.0.
      </Text>
    </Screen>
  );
}

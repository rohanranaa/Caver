import React, { useState } from "react";
import { Text, View, Image, Switch } from "react-native";
import { Screen, Heading, Button, Choices, Chip } from "../stylematch/UI";
import { useStyleStore } from "./store";
import { useAuth } from "./AuthContext";
import { s } from "./theme";
import { OCCASIONS } from "../stylematch/data";
import { checkOutfit, ESSENTIALS } from "../stylematch/outfitCheck";
import { pickClothingPhoto } from "../platform/photos";
import { analyzeOutfit, analysisConfigured } from "../platform/outfitAnalysis";
import ColorPairingCard from "./ColorPairingCard";
export default function OutfitCheckScreen({ navigation, route }) {
  const { items, weather } = useStyleStore();
  const auth = useAuth();
  const [selected, setSelected] = useState(
    route.params?.items?.map((item) => item.id) || [],
  );
  const [occasion, setOccasion] = useState("Casual");
  const [photo, setPhoto] = useState(null);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [replace, setReplace] = useState([]);
  const chosen = items.filter(
    (item) => selected.includes(item.id) && item.status === "owned",
  );
  const result = checkOutfit(chosen, weather, occasion);
  const suggestions = [
    ...new Set([
      ...result.suggestions,
      ...replace,
      ...(analysis?.suggestions || []),
    ]),
  ];
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(e.message || "Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const toggle = (item) => {
    if (busy) return;
    setAnalysis(null);
    setSelected((ids) =>
      ids.includes(item.id)
        ? ids.filter((id) => id !== item.id)
        : [
            ...ids.filter(
              (id) =>
                items.find((piece) => piece.id === id)?.category !==
                item.category,
            ),
            item.id,
          ],
    );
  };
  return (
    <Screen>
      <Heading
        eyebrow="THE OUTFIT CHECK"
        title="See how it comes together."
        subtitle="Build a look from your wardrobe or take a photo wearing it. Get ideas about the clothes, colors, and occasion."
      />
      <Choices
        label="Occasion"
        values={OCCASIONS}
        value={occasion}
        onChange={(value) => {
          if (busy) return;
          setOccasion(value);
          setAnalysis(null);
        }}
      />
      <View style={s.card}>
        <Text style={s.h3}>Camera outfit check</Text>
        <Text style={s.small}>
          Take a photo for an AI check, or choose one from your gallery. A photo
          can suggest styling changes; it cannot establish exact sizing or
          comfort.
        </Text>
        {photo && (
          <Image
            accessibilityLabel="Your outfit photo"
            source={{ uri: photo }}
            style={{ width: "100%", height: 300, borderRadius: 16 }}
            resizeMode="contain"
          />
        )}
        <Button
          title="Take outfit photo"
          icon="camera"
          disabled={busy}
          onPress={() =>
            run(async () => {
              const next = await pickClothingPhoto(true);
              if (next) {
                setPhoto(next);
                setAnalysis(null);
                setConsent(false);
              }
            })
          }
        />
        <Button
          title="Choose outfit photo"
          secondary
          disabled={busy}
          onPress={() =>
            run(async () => {
              const next = await pickClothingPhoto(false);
              if (next) {
                setPhoto(next);
                setAnalysis(null);
                setConsent(false);
              }
            })
          }
        />
        {photo && (
          <Button
            title="Remove photo"
            secondary
            disabled={busy}
            onPress={() => {
              setPhoto(null);
              setAnalysis(null);
              setConsent(false);
            }}
          />
        )}
        {!analysisConfigured && (
          <Text style={s.small}>
            AI photo analysis is awaiting service setup. The wardrobe check
            below works now.
          </Text>
        )}
        <View style={s.row}>
          <Switch
            accessibilityLabel="Allow photo analysis"
            value={consent}
            onValueChange={setConsent}
            disabled={busy}
          />
          <Text style={[s.small, s.fill]}>
            Send this photo and selected clothing details to the AI service for
            this check. Photos are not saved by StyleMatch’s analysis server;
            the provider’s retention policy applies.
          </Text>
        </View>
        <Button
          title={busy ? "Checking…" : "Analyze my outfit"}
          disabled={
            busy || !photo || !consent || !analysisConfigured || !auth?.session
          }
          onPress={() =>
            run(async () =>
              setAnalysis(
                await analyzeOutfit({
                  image: photo,
                  items: chosen,
                  occasion,
                  token: auth.session.access_token,
                }),
              ),
            )
          }
        />
        {!auth?.session && (
          <Button
            title="Log in for AI analysis"
            secondary
            onPress={() => navigation.navigate("Account")}
          />
        )}
        {!!error && (
          <Text accessibilityRole="alert" style={s.error}>
            {error}
          </Text>
        )}
        {analysis && (
          <View style={s.quiet}>
            <Text style={s.h3}>AI styling feedback</Text>
            <Text style={s.body}>{analysis.summary}</Text>
            {analysis.tips.map((tip, i) => (
              <Text key={i} style={s.body}>
                • {tip}
              </Text>
            ))}
          </View>
        )}
      </View>
      <Text style={s.h2}>Choose your pieces</Text>
      {[...ESSENTIALS, "Jackets"].map((category) => (
        <View key={category} style={s.section}>
          <Text style={s.label}>{category}</Text>
          <View style={s.wrap}>
            {items
              .filter(
                (item) => item.category === category && item.status === "owned",
              )
              .map((item) => (
                <Chip
                  key={item.id}
                  selected={selected.includes(item.id)}
                  onPress={() => toggle(item)}
                >
                  {item.name}
                </Chip>
              ))}
          </View>
          {!items.some(
            (item) => item.category === category && item.status === "owned",
          ) && (
            <Text style={s.small}>No owned {category.toLowerCase()} yet.</Text>
          )}
        </View>
      ))}
      <Button
        title="Add a clothing piece"
        secondary
        onPress={() => navigation.navigate("Clothing")}
      />
      <ColorPairingCard look={{ items: chosen, occasion }} />
      <View style={s.quiet}>
        <Text style={s.h3}>Wardrobe check</Text>
        {result.notes.map((note) => (
          <Text key={note} style={s.body}>
            {note}
          </Text>
        ))}
        {!!result.gaps.length && (
          <Text style={s.body}>Missing: {result.gaps.join(", ")}.</Text>
        )}
        <Text style={s.small}>
          Local color and weather rules ·{" "}
          {weather.source === "Open-Meteo"
            ? "current weather"
            : "sample weather"}
        </Text>
      </View>
      <Choices
        label="Want a different piece?"
        values={[...ESSENTIALS, "Jackets"]}
        value={replace}
        multiple
        onChange={(category) =>
          setReplace((current) =>
            current.includes(category)
              ? current.filter((value) => value !== category)
              : [...current, category],
          )
        }
      />
      {!!suggestions.length && (
        <Button
          title={`Shop suggestions · ${suggestions.join(", ")}`}
          icon="bag"
          onPress={() =>
            navigation.navigate("Discover", { categories: suggestions })
          }
        />
      )}
      <Text style={s.small}>
        Try pieces you already own first. Shopping suggestions are optional, and
        buying is never required for a good outfit.
      </Text>
    </Screen>
  );
}

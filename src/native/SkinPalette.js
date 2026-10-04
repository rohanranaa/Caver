import React, { useState } from "react";
import { View, Image } from "react-native";
import { Text, Pressable, Switch } from "./i18n";
import { useTheme } from "./theme";
import { Button, Choices } from "../stylematch/UI";
import { SKIN_SHADES, suggestedPalette } from "../stylematch/skinPalette";
import { COLORS } from "../stylematch/data";
import { useAuth } from "./AuthContext";
import { pickClothingPhoto } from "../platform/photos";
import { analyzePhoto, analysisConfigured } from "../platform/outfitAnalysis";
export default function SkinPalette({ draft, setDraft }) {
  const { s, colors } = useTheme();
  const auth = useAuth();
  const [photo, setPhoto] = useState(null),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [estimate, setEstimate] = useState(null),
    [error, setError] = useState("");
  const palette = suggestedPalette(draft.tone, draft.undertone);
  const select = (shade) =>
    setDraft((value) => ({
      ...value,
      shadeId: shade.id,
      skinHex: shade.hex,
      tone: shade.tone,
    }));
  const run = async (action) => {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  const pick = (camera) =>
    run(async () => {
      const image = await pickClothingPhoto(camera);
      if (image) {
        setPhoto(image);
        setEstimate(null);
        setConsent(false);
      }
    });
  return (
    <View style={s.section}>
      <Text style={s.h2}>Your shade, your choice.</Text>
      <Text style={s.small}>
        Lighting, makeup, and camera processing change apparent colors. This is
        a styling estimate, not a measurement.
      </Text>
      <View style={s.wrap}>
        {SKIN_SHADES.map((shade) => (
          <Pressable
            key={shade.id}
            accessibilityRole="button"
            accessibilityLabel={`Skin shade ${shade.id}`}
            accessibilityState={{ selected: draft.shadeId === shade.id }}
            onPress={() => select(shade)}
            style={{ alignItems: "center", gap: 5 }}
          >
            <View
              style={[
                s.swatch,
                {
                  backgroundColor: shade.hex,
                  width: 45,
                  height: 45,
                  borderWidth: draft.shadeId === shade.id ? 3 : 1,
                  borderColor:
                    draft.shadeId === shade.id ? colors.green : colors.line,
                },
              ]}
            />
            <Text style={s.small}>{shade.id}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={s.body}>
        {draft.tone === "Light" ? "Light skin" : draft.tone} ·{" "}
        {draft.skinHex || "Skin shade"}
      </Text>
      <Choices
        label="Undertone"
        values={["Warm", "Cool", "Neutral"]}
        value={draft.undertone}
        onChange={(undertone) => setDraft((value) => ({ ...value, undertone }))}
      />
      <View style={s.wrap}>
        <Button
          title="Take a daylight selfie"
          icon="camera"
          secondary
          disabled={busy}
          onPress={() => pick(true)}
        />
        <Button
          title="Choose a selfie"
          secondary
          disabled={busy}
          onPress={() => pick(false)}
        />
      </View>
      {photo && (
        <View style={s.card}>
          <Image
            source={{ uri: photo }}
            accessibilityLabel="Skin palette photo"
            resizeMode="contain"
            style={{ height: 220, width: "100%", borderRadius: 14 }}
          />
          <Button
            title="Remove photo"
            secondary
            disabled={busy}
            onPress={() => {
              setPhoto(null);
              setEstimate(null);
              setConsent(false);
            }}
          />
          <View style={s.row}>
            <Switch
              accessibilityLabel="Allow skin palette analysis"
              value={consent}
              onValueChange={setConsent}
              disabled={busy}
            />
            <Text style={[s.small, s.fill]}>
              Send this photo for a visible skin-shade estimate. No identity or
              ethnicity analysis.
            </Text>
          </View>
          <Button
            title={busy ? "Analyzing…" : "Estimate my shade"}
            disabled={busy || !consent || !analysisConfigured || !auth?.session}
            onPress={() =>
              run(async () => {
                setEstimate(null);
                const result = await analyzePhoto({
                  image: photo,
                  kind: "skin",
                  token: auth.session.access_token,
                });
                if (!result.detected)
                  throw new Error(
                    "A clear single-person selfie is needed. Try natural daylight or choose a shade manually.",
                  );
                setEstimate(result);
              })
            }
          />
          {estimate && (
            <View style={s.quiet}>
              <Text style={s.body}>
                {estimate.shadeId} · {estimate.undertone}
              </Text>
              <Text style={s.small}>{estimate.explanation}</Text>
              <Text style={s.small}>{estimate.confidence}</Text>
              <Button
                title="Apply shade estimate"
                secondary
                onPress={() => {
                  const shade = SKIN_SHADES.find(
                    (value) => value.id === estimate.shadeId,
                  );
                  if (!shade) return;
                  setDraft((value) => ({
                    ...value,
                    shadeId: shade.id,
                    skinHex: shade.hex,
                    tone: shade.tone,
                    undertone:
                      estimate.undertone === "Uncertain"
                        ? value.undertone
                        : estimate.undertone,
                  }));
                  setEstimate(null);
                  setPhoto(null);
                  setConsent(false);
                }}
              />
            </View>
          )}
        </View>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <Text style={s.small}>
        Manual shades work without AI. Photo estimates require the configured
        service and login.
      </Text>
      {[
        ["Colors to try near your face", palette.glowColors],
        ["Colors to compare in daylight", palette.compareColors],
      ].map(
        ([title, list]) =>
          !!list.length && (
            <View key={title} style={s.quiet}>
              <Text style={s.h3}>{title}</Text>
              <View style={s.wrap}>
                {list.map((name) => (
                  <View key={name} style={{ alignItems: "center", gap: 5 }}>
                    <View
                      style={[
                        s.swatch,
                        {
                          backgroundColor: COLORS.find(
                            (color) => color.name === name,
                          ).hex,
                        },
                      ]}
                    />
                    <Text style={s.small}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ),
      )}
      <Text style={s.small}>
        No color is universally flattering or dull. Compare fabrics in daylight
        and keep the colors you enjoy.
      </Text>
      <Button
        title="Use this suggested palette"
        secondary
        onPress={() =>
          setDraft((value) => ({
            ...value,
            glowColors: palette.glowColors,
            avoidColors: value.avoidColors.filter(
              (color) => !palette.glowColors.includes(color),
            ),
          }))
        }
      />
    </View>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Switch,
  useWindowDimensions,
} from "react-native";
import { useStyleStore, getPersistenceError } from "./store";
import { COLORS, CATEGORIES } from "../stylematch/data";
import {
  Screen,
  Heading,
  Button,
  Input,
  Choices,
  Confirm,
  EmptyState,
} from "../stylematch/UI";
import Garment from "../stylematch/Garment";
import Icon from "../stylematch/Icon";
import { pickClothingPhoto } from "../platform/photos";
import { s, colors } from "./theme";
const TYPES = {
  Tops: ["shirt", "tshirt", "sweater"],
  Bottoms: ["trousers"],
  Shoes: ["sneakers", "boots", "loafers"],
  Jackets: ["jacket"],
  Accessories: ["bag"],
};
const STYLES = [
  "Minimal",
  "Casual",
  "Smart Casual",
  "Streetwear",
  "Classic",
  "Elegant",
  "Trendy",
  "Sporty",
];
export function ClothingScreen({ navigation, route }) {
  const { items, saveItem, notify } = useStyleStore();
  const existing = items.find((i) => i.id === route.params?.id);
  const [draft, setDraft] = useState(
    existing || {
      name: "",
      category: "Tops",
      type: "shirt",
      color: "Cream",
      brand: "",
      style: "Smart Casual",
      season: "All season",
      status: "owned",
      formal: 2,
      waterproof: false,
    },
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { width } = useWindowDimensions();
  const update = (key, value) => setDraft((d) => ({ ...d, [key]: value }));
  const pick = async (camera) => {
    setError("");
    setBusy(true);
    try {
      const image = await pickClothingPhoto(camera);
      if (image) update("image", image);
    } catch (e) {
      setError(e.message || "Couldn’t open your photos. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  const save = () => {
    if (!draft.name.trim()) {
      setError("Give this piece a name.");
      return;
    }
    saveItem({
      ...draft,
      name: draft.name.trim(),
      id:
        existing?.id ||
        `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    });
    navigation.goBack();
    setTimeout(() => {
      if (getPersistenceError()) notify(getPersistenceError());
    }, 300);
  };
  return (
    <Screen>
      <Heading
        eyebrow="ONE PIECE. SO MANY POSSIBILITIES."
        title={
          existing
            ? "The little details."
            : "Meet your wardrobe’s new addition."
        }
        subtitle="Take a photo, choose one from your gallery, or use an illustration."
      />
      <View style={{ flexDirection: width > 800 ? "row" : "column", gap: 25 }}>
        <View style={{ flex: 1, gap: 12 }}>
          <View style={s.largeArt}>
            <Garment item={draft} />
          </View>
          <View style={s.wrap}>
            <Button
              title="Take photo"
              icon="camera"
              secondary
              disabled={busy}
              onPress={() => pick(true)}
            />
            <Button
              title="Gallery"
              icon="upload"
              secondary
              disabled={busy}
              onPress={() => pick(false)}
            />
            {draft.image && (
              <Button
                title="Use illustration"
                secondary
                onPress={() => update("image", undefined)}
              />
            )}
          </View>
          <Text style={s.small}>
            Photos stay on your device. Tags are entered manually until the AI
            service is connected. Use an image under 2 MB.
          </Text>
        </View>
        <View style={{ flex: 1, gap: 22 }}>
          <Input
            label="Name"
            placeholder="e.g. My favorite linen shirt"
            value={draft.name}
            onChangeText={(v) => update("name", v)}
            maxLength={60}
          />
          <Choices
            label="Category"
            values={CATEGORIES.slice(1)}
            value={draft.category}
            onChange={(category) =>
              setDraft((d) => ({ ...d, category, type: TYPES[category][0] }))
            }
          />
          <Choices
            label="Type"
            values={TYPES[draft.category]}
            value={draft.type}
            onChange={(v) => update("type", v)}
          />
          <Choices
            label="Color"
            values={COLORS.map((c) => c.name)}
            value={draft.color}
            onChange={(v) => update("color", v)}
          />
          <Choices
            label="Style"
            values={STYLES}
            value={draft.style}
            onChange={(v) => update("style", v)}
          />
          <Choices
            label="Season"
            values={["All season", "Spring", "Summer", "Autumn", "Winter"]}
            value={draft.season}
            onChange={(v) => update("season", v)}
          />
          <Choices
            label="Dress code"
            values={["Casual", "Smart casual", "Formal"]}
            value={["Casual", "Smart casual", "Formal"][draft.formal - 1]}
            onChange={(v) =>
              update(
                "formal",
                ["Casual", "Smart casual", "Formal"].indexOf(v) + 1,
              )
            }
          />
          <Choices
            label="Status"
            values={["owned", "incoming"]}
            value={draft.status}
            onChange={(v) => update("status", v)}
          />
          <Input
            label="Brand (optional)"
            value={draft.brand}
            onChangeText={(v) => update("brand", v)}
            maxLength={35}
          />
          {draft.category === "Shoes" && (
            <View style={s.between}>
              <Text style={s.body}>Waterproof shoes</Text>
              <Switch
                accessibilityLabel="Waterproof shoes"
                value={!!draft.waterproof}
                onValueChange={(v) => update("waterproof", v)}
                trackColor={{ true: colors.green }}
              />
            </View>
          )}
        </View>
      </View>
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <Button
        title={
          busy
            ? "Opening photos…"
            : existing
              ? "Save changes"
              : "Add to my wardrobe"
        }
        icon="check"
        onPress={save}
        disabled={busy}
      />
    </Screen>
  );
}

export function ClothingDetailScreen({ navigation, route }) {
  const { items, profile, removeItem } = useStyleStore();
  const item = items.find((i) => i.id === route.params.id);
  const [deleting, setDeleting] = useState(false);
  if (!item)
    return (
      <Screen>
        <EmptyState
          title="This piece has left your wardrobe."
          description="Add a new favorite or choose another piece to style."
          action={
            <Button
              title="Back to wardrobe"
              onPress={() =>
                navigation.navigate("Main", { screen: "Wardrobe" })
              }
            />
          }
        />
      </Screen>
    );
  return (
    <Screen>
      <View style={s.largeArt}>
        <Garment item={item} />
      </View>
      <Heading
        eyebrow={item.brand || "YOUR WARDROBE"}
        title={item.name}
        subtitle={`${item.color} · ${item.category} · ${item.season}`}
      />
      <View style={s.quiet}>
        <View style={s.row}>
          <Icon name="sparkle" />
          <Text style={s.body}>
            {profile.glowColors.includes(item.color)
              ? "Right in your glow palette."
              : profile.avoidColors.includes(item.color)
                ? "A color you prefer to avoid."
                : "A versatile supporting color."}
          </Text>
        </View>
        <Text style={s.small}>
          {item.lastWornAt
            ? `Last worn ${new Date(item.lastWornAt).toLocaleDateString()}. Ready for a fresh combination?`
            : "A good piece deserves a good outing. Let’s build a look around it."}
        </Text>
      </View>
      {item.status === "incoming" ? (
        <View style={s.info}>
          <Text style={s.body}>
            This piece is incoming. Edit its status to “owned” when it arrives
            to include it in outfits.
          </Text>
        </View>
      ) : (
        <Button
          title="Style with this piece"
          icon="sparkle"
          onPress={() => navigation.navigate("Style", { lockedId: item.id })}
        />
      )}
      <Button
        title="Edit details"
        icon="edit"
        secondary
        onPress={() => navigation.navigate("Clothing", { id: item.id })}
      />
      <Button
        title="Remove piece"
        icon="trash"
        secondary
        onPress={() => setDeleting(true)}
      />
      <Confirm
        visible={deleting}
        title="Make a little room?"
        description={`Remove “${item.name}” from your wardrobe? Saved looks will keep their original details.`}
        action="Remove piece"
        onClose={() => setDeleting(false)}
        onConfirm={() => {
          removeItem(item.id);
          setDeleting(false);
          navigation.goBack();
        }}
      />
    </Screen>
  );
}

export function PreferencesScreen({ navigation, route }) {
  const { profile, saveProfile } = useStyleStore();
  const [draft, setDraft] = useState(profile);
  const paletteOnly = route.params?.paletteOnly;
  const toggleColor = (list, color) =>
    setDraft((d) => {
      const other = list === "glowColors" ? "avoidColors" : "glowColors";
      return {
        ...d,
        [list]: d[list].includes(color)
          ? d[list].filter((c) => c !== color)
          : [...d[list], color],
        [other]: d[other].filter((c) => c !== color),
      };
    });
  return (
    <Screen>
      <Heading
        eyebrow="UNIQUELY YOU"
        title={
          paletteOnly ? "Your personal color story." : "Make yourself at home."
        }
        subtitle="Style is personal. Your preferences always have the final say."
      />
      {!paletteOnly && (
        <Input
          label="Your name"
          value={draft.name}
          maxLength={50}
          onChangeText={(name) => setDraft((d) => ({ ...d, name }))}
        />
      )}
      <Choices
        label="Skin tone"
        values={["Very light", "Light", "Medium", "Tan", "Deep"]}
        value={draft.tone}
        onChange={(tone) => setDraft((d) => ({ ...d, tone }))}
      />
      <Choices
        label="Undertone"
        values={["Warm", "Cool", "Neutral"]}
        value={draft.undertone}
        onChange={(undertone) => setDraft((d) => ({ ...d, undertone }))}
      />
      {!paletteOnly && (
        <Choices
          label="Styles you feel good in"
          values={STYLES}
          value={draft.styles}
          multiple
          onChange={(style) =>
            setDraft((d) => ({
              ...d,
              styles: d.styles.includes(style)
                ? d.styles.filter((s) => s !== style)
                : [...d.styles, style],
            }))
          }
        />
      )}
      <View style={s.section}>
        <Text style={s.label}>Your glow colors · choose your favorites</Text>
        <View style={[s.wrap, { gap: 17 }]}>
          {COLORS.map((color) => (
            <Pressable
              key={color.name}
              accessibilityRole="button"
              accessibilityLabel={`Glow color ${color.name}`}
              accessibilityState={{
                selected: draft.glowColors.includes(color.name),
              }}
              onPress={() => toggleColor("glowColors", color.name)}
              style={{ alignItems: "center", gap: 9, width: 47 }}
            >
              <View
                style={[
                  s.swatch,
                  {
                    backgroundColor: color.hex,
                    borderWidth: draft.glowColors.includes(color.name) ? 3 : 1,
                    borderColor: draft.glowColors.includes(color.name)
                      ? colors.green
                      : "#00000015",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                {draft.glowColors.includes(color.name) && (
                  <Icon
                    name="check"
                    size={17}
                    color={
                      ["Cream", "White"].includes(color.name)
                        ? colors.green
                        : "#fff"
                    }
                  />
                )}
              </View>
              <Text style={[s.small, { fontSize: 9 }]}>{color.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <Choices
        label="Colors you prefer to skip"
        values={COLORS.map((c) => c.name)}
        value={draft.avoidColors}
        multiple
        onChange={(color) => toggleColor("avoidColors", color)}
      />
      <Text style={s.small}>
        Used for color compatibility, never as a beauty rating. Your chosen glow
        and avoid lists take priority over undertone labels.
      </Text>
      <Button
        title="Save my preferences"
        icon="check"
        onPress={() => {
          saveProfile({ ...draft, name: draft.name.trim() || "Guest" });
          navigation.goBack();
        }}
      />
    </Screen>
  );
}

export function ColorIntroScreen({ navigation }) {
  return (
    <Screen>
      <View style={s.emptyIcon}>
        <Icon name="camera" size={29} />
      </View>
      <Heading
        eyebrow="LET’S FIND YOUR COLORS"
        title="A palette that feels like you."
        subtitle="Skin tone is only used for color compatibility, never to rate you. Lighting can affect readings, and you can always change your palette."
      />
      <View style={s.quiet}>
        {[
          "Find soft, natural daylight.",
          "Skip filters and keep your face visible.",
          "Choose the colors that make you feel good.",
        ].map((tip, i) => (
          <View key={tip} style={s.row}>
            <Text style={s.eyebrow}>0{i + 1}</Text>
            <Text style={s.body}>{tip}</Text>
          </View>
        ))}
      </View>
      <View style={s.info}>
        <Text style={s.body}>
          Selfie analysis isn’t connected yet. Choose your tone and colors
          manually—no face photo is collected.
        </Text>
      </View>
      <Button
        title="Choose my colors"
        icon="arrow"
        onPress={() =>
          navigation.navigate("Preferences", { paletteOnly: true })
        }
      />
    </Screen>
  );
}

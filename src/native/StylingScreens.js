import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Share,
  Platform,
  Linking,
  useWindowDimensions,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useStyleStore } from "./store";
import { createOutfit } from "../stylematch/service";
import { OCCASIONS, VIBES, PRODUCTS } from "../stylematch/data";
import {
  Screen,
  Heading,
  Button,
  Choices,
  Input,
  OutfitBoard,
  Score,
  Chip,
} from "../stylematch/UI";
import Garment from "../stylematch/Garment";
import Icon from "../stylematch/Icon";
import { s, colors } from "./theme";
import { BRAND_LINKS } from "../stylematch/outfitCheck";
import ColorPairingCard from "./ColorPairingCard";
import { COLOR_APPROACHES } from "../stylematch/colorMatching";

export function StyleScreen({ navigation, route }) {
  const state = useStyleStore();
  const [occasion, setOccasion] = useState(route.params?.occasion || "Casual");
  const [mood, setMood] = useState(route.params?.mood || "Effortless");
  const [colorApproach, setColorApproach] = useState(
    route.params?.colorApproach || "Balanced",
  );
  const [formality, setFormality] = useState("Relaxed");
  const [busy, setBusy] = useState(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const generate = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const options = {
        items: state.items,
        profile: state.profile,
        history: state.history,
        weather: state.weather,
        occasion,
        mood,
        colorApproach,
        formality: ["Relaxed", "Smart casual", "Formal"].indexOf(formality) + 1,
        lockedId: route.params?.lockedId,
        offset: route.params?.offset || 0,
      };
      const look = await createOutfit(options);
      if (active.current)
        navigation.replace("Result", {
          look,
          preferences: {
            occasion,
            mood,
            colorApproach,
            formality: options.formality,
            lockedId: options.lockedId,
            offset: options.offset,
          },
        });
    } catch {
      if (active.current)
        state.notify("Couldn’t build this look. Please try again.");
    } finally {
      if (active.current) setBusy(false);
    }
  };
  if (busy)
    return (
      <Screen>
        <View style={[s.empty, { paddingTop: 60 }]}>
          <OutfitBoard items={state.items.slice(0, 3)} />
          <ActivityIndicator size="large" color={colors.green} />
          <Text accessibilityRole="header" style={s.h2}>
            A little style magic…
          </Text>
          <Text style={[s.body, s.centered]}>
            Checking the weather, matching your colors, and finding pieces that
            feel like you.
          </Text>
        </View>
      </Screen>
    );
  return (
    <Screen>
      <Heading
        eyebrow="A LOOK FOR EVERY LITTLE PLAN"
        title="Tell me the plan."
        subtitle="A few details, and we’ll find your kind of outfit."
      />
      <Choices
        label="What’s the occasion?"
        values={OCCASIONS}
        value={occasion}
        onChange={setOccasion}
      />
      <Choices
        label="And the vibe?"
        values={VIBES}
        value={mood}
        onChange={setMood}
      />
      <Choices
        label="A little casual or all dressed up?"
        values={["Relaxed", "Smart casual", "Formal"]}
        value={formality}
        onChange={setFormality}
      />
      <Choices
        label="How should the colors work together?"
        values={COLOR_APPROACHES}
        value={colorApproach}
        onChange={setColorApproach}
      />
      <View style={[s.quiet, s.between]}>
        <View style={s.row}>
          <Icon name="sun" />
          <Text style={s.body}>
            {state.weather.temperature}°C · {state.weather.condition}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate("Weather")}
        >
          <Text style={s.linkText}>Change</Text>
        </Pressable>
      </View>
      {route.params?.lockedId && (
        <Text style={s.small}>
          Building around{" "}
          {state.items.find((i) => i.id === route.params.lockedId)?.name}.
        </Text>
      )}
      <Button title="Create my outfit" icon="sparkle" onPress={generate} />
    </Screen>
  );
}

export function ResultScreen({ navigation, route }) {
  const {
    look,
    preferences = {
      occasion: look.occasion,
      mood: look.mood,
      formality: 1,
      colorApproach: look.colorApproach,
    },
  } = route.params;
  const state = useStyleStore();
  const [busy, setBusy] = useState(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const next = async (restyle = false) => {
    if (busy) return;
    setBusy(true);
    try {
      const offset = (preferences.offset || 0) + 1;
      const fresh = await createOutfit({
        ...preferences,
        items: state.items,
        profile: state.profile,
        history: state.history,
        weather: state.weather,
        offset,
        relaxDressCode: restyle,
      });
      if (active.current)
        navigation.replace("Result", {
          look: { ...fresh, restyled: restyle },
          preferences: { ...preferences, offset },
        });
    } catch {
      if (active.current)
        state.notify("Couldn’t restyle this look. Please try again.");
    } finally {
      if (active.current) setBusy(false);
    }
  };
  const share = async () => {
    const message = `${look.name} · ${look.scores.total}% match\n${look.items.map((i) => i.name).join(" + ")}\nStyled with StyleMatch`;
    try {
      if (Platform.OS === "web") {
        await Clipboard.setStringAsync(message);
        state.notify("Look copied. Share it with someone stylish.");
      } else await Share.share({ title: look.name, message });
    } catch {
      state.notify("Sharing isn’t available right now. Try saving the look.");
    }
  };
  if (!look.items.length)
    return (
      <Screen>
        <Heading
          eyebrow={
            look.exhausted
              ? "A LITTLE ROOM FOR SOMETHING NEW"
              : "LET’S COMPLETE YOUR LOOK"
          }
          title={
            look.exhausted
              ? "Ready for a fresh combination?"
              : `Your look needs ${look.gap.join(" & ").toLowerCase()}.`
          }
          subtitle={look.explanation}
        />
        {!look.exhausted && (
          <>
            <View style={s.card}>
              <Text style={s.eyebrow}>OPTION 01</Text>
              <Text style={s.h2}>Restyle with what I own.</Text>
              <Text style={s.body}>
                Relax the dress code and try another combination from your
                wardrobe.
              </Text>
              <Button
                title={busy ? "Restyling…" : "Restyle my look"}
                disabled={busy}
                onPress={() => next(true)}
                icon="refresh"
              />
            </View>
            <View style={s.card}>
              <Text style={s.eyebrow}>OPTION 02</Text>
              <Text style={s.h2}>Find the missing piece.</Text>
              <Text style={s.body}>
                Explore sample pieces in colors that complement your wardrobe.
              </Text>
              <Button
                title="Explore the collection"
                secondary
                onPress={() =>
                  navigation.navigate("Discover", { categories: look.gap })
                }
              />
            </View>
          </>
        )}
        <Button
          title="Add clothing"
          icon="plus"
          onPress={() => navigation.navigate("Clothing")}
        />
        <Button
          title="Change my plan"
          secondary
          onPress={() => navigation.replace("Style")}
        />
      </Screen>
    );
  return (
    <Screen>
      <Heading
        eyebrow={
          look.restyled ? "RESTYLED WITH YOUR WARDROBE" : "YOUR LOOK IS READY"
        }
        title={look.name}
        subtitle={`${look.occasion} · ${look.mood} · ${look.weather.temperature}°C`}
      />
      <OutfitBoard items={look.items} />
      <Button
        title="Check this outfit on me"
        icon="camera"
        secondary
        onPress={() =>
          navigation.navigate("OutfitCheck", { items: look.items })
        }
      />
      <ColorPairingCard look={look} />
      <View style={[s.card, s.row]}>
        <View style={{ alignItems: "center", width: 110 }}>
          <Text style={s.resultScore}>
            {look.scores.total}
            <Text style={{ fontSize: 21 }}>%</Text>
          </Text>
          <Text style={s.small}>Made for you</Text>
        </View>
        <View style={{ flex: 1, gap: 13 }}>
          {[
            ["skinTone", "Your palette"],
            ["occasion", "Occasion"],
            ["weather", "Weather"],
            ["mood", "Mood"],
          ].map(([key, label]) => (
            <View key={key} style={{ gap: 6 }}>
              <View style={s.between}>
                <Text style={s.small}>{label}</Text>
                <Text style={s.small}>{look.scores[key]}%</Text>
              </View>
              <View style={s.barTrack}>
                <View style={[s.bar, { width: `${look.scores[key]}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={s.quiet}>
        <View style={s.row}>
          <Icon name="sparkle" />
          <Text style={s.h3}>
            {look.restyled ? "What changed" : "Why this works"}
          </Text>
        </View>
        <Text style={s.body}>
          {look.restyled
            ? "We relaxed the dress code to find a combination among your own pieces. "
            : ""}
          {look.explanation}
        </Text>
      </View>
      <View style={s.wrap}>
        <Button
          title={
            state.looks.some((l) => l.id === look.id) ? "Saved" : "Save look"
          }
          secondary
          icon="heart"
          onPress={() => state.saveLook(look)}
        />
        <Button
          title={busy ? "Styling…" : "Try another"}
          secondary
          icon="refresh"
          disabled={busy}
          onPress={() => next(look.restyled)}
        />
        <Button title="Share" secondary icon="share" onPress={share} />
      </View>
      <Button
        title="I’m wearing this"
        icon="check"
        onPress={() => {
          if (state.wearLook(look))
            navigation.navigate("Main", { screen: "Looks" });
        }}
      />
    </Screen>
  );
}

export function DiscoverScreen({ navigation, route }) {
  const categories = route?.params?.categories || [];
  const { profile } = useStyleStore();
  const { width } = useWindowDimensions();
  const [brand, setBrand] = useState("All brands");
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState("All prices");
  const products = PRODUCTS.filter(
    (p) =>
      (!categories.length || categories.includes(p.category)) &&
      (brand === "All brands" || p.brand === brand) &&
      `${p.name} ${p.brand} ${p.color}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (price === "All prices" || p.price < (price === "Under $50" ? 50 : 100)),
  ).sort(
    (a, b) =>
      Number(profile.avoidColors.includes(a.color)) -
        Number(profile.avoidColors.includes(b.color)) || b.match - a.match,
  );
  return (
    <Screen>
      <Heading
        eyebrow="A THOUGHTFUL ADDITION"
        title="Meet your next favorite."
        subtitle="Pieces that work with your wardrobe. And with you."
      />
      {!!categories.length && (
        <View style={s.card}>
          <Text style={s.h3}>Complete your look: {categories.join(", ")}</Text>
          <Text style={s.small}>
            Browse these brands for the missing or replacement pieces. Check
            sizes, prices, and availability on their sites.
          </Text>
          {BRAND_LINKS.filter((brand) =>
            brand.categories.some((category) => categories.includes(category)),
          ).map((brand) => (
            <Button
              key={brand.name}
              title={`Browse ${brand.name}`}
              secondary
              onPress={async () => {
                try {
                  await Linking.openURL(brand.url);
                } catch {
                  useStyleStore
                    .getState()
                    .notify("Could not open the brand. Please retry.");
                }
              }}
            />
          ))}
        </View>
      )}
      <View style={s.info}>
        <Text style={s.small}>
          Sample collection. Prices and match scores are illustrative; check
          current availability at the retailer.
        </Text>
      </View>
      <View style={s.search}>
        <Icon name="search" size={18} />
        <TextInput
          accessibilityLabel="Search products"
          placeholder="Find your missing piece…"
          value={search}
          onChangeText={setSearch}
          style={s.searchText}
        />
      </View>
      <Choices
        label="Brands"
        values={["All brands", ...new Set(PRODUCTS.map((p) => p.brand))]}
        value={brand}
        onChange={setBrand}
      />
      <Choices
        label="Budget"
        values={["All prices", "Under $50", "Under $100"]}
        value={price}
        onChange={setPrice}
      />
      <View style={s.grid}>
        {products.map((product) => (
          <Pressable
            key={product.id}
            accessibilityRole="button"
            accessibilityLabel={`View ${product.name}`}
            onPress={() => navigation.navigate("Product", { id: product.id })}
            style={[s.itemCard, { width: width > 800 ? "23.8%" : "47.8%" }]}
          >
            <View style={s.itemArt}>
              <Garment item={product} />
            </View>
            <View style={s.itemInfo}>
              <Text style={s.brand}>{product.brand}</Text>
              <Text style={s.itemName}>{product.name}</Text>
              <Text style={s.body}>${product.price}</Text>
              <Score value={product.match} />
            </View>
          </Pressable>
        ))}
      </View>
      {!products.length && (
        <Text style={s.body}>
          No pieces match these filters. Try another search.
        </Text>
      )}
    </Screen>
  );
}

export function ProductScreen({ navigation, route }) {
  const product = PRODUCTS.find((p) => p.id === route.params.id);
  const { items, saveItem, notify } = useStyleStore();
  if (!product)
    return (
      <Screen>
        <Text style={s.body}>This sample product is no longer available.</Text>
      </Screen>
    );
  return (
    <Screen>
      <View style={s.largeArt}>
        <Garment item={product} />
      </View>
      <Heading
        eyebrow={product.brand}
        title={product.name}
        subtitle={`${product.color} · $${product.price} sample price`}
      />
      <Score value={product.match} />
      <Text style={s.body}>
        Choose your size and check the current price on the retailer’s website.
        This preview doesn’t place orders.
      </Text>
      <Button
        title={`Visit ${product.brand}`}
        icon="arrow"
        onPress={async () => {
          try {
            await Linking.openURL(product.url);
          } catch {
            notify("Could not open the retailer. Please try again.");
          }
        }}
      />
      <Button
        title="I’ve ordered this · add as incoming"
        secondary
        onPress={() => {
          if (items.some((i) => i.id === product.id)) {
            notify("This piece is already in your wardrobe.");
            return;
          }
          saveItem({
            ...product,
            status: "incoming",
            season: "All season",
            style: "Classic",
            formal: 2,
          });
          notify("Added as incoming. Mark it owned when it arrives.");
          navigation.navigate("Main", { screen: "Wardrobe" });
        }}
      />
    </Screen>
  );
}

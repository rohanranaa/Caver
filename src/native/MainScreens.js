import React, { useMemo, useState, useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import { Text, Pressable } from "./i18n";
import { useStyleStore } from "./store";
import { recommend } from "../stylematch/service";
import { COLORS, CATEGORIES, OCCASIONS } from "../stylematch/data";
import {
  Screen,
  SearchBar,
  Button,
  Heading,
  SectionTitle,
  OutfitBoard,
  Score,
  GarmentCard,
  EmptyState,
  Chip,
  Confirm,
} from "../stylematch/UI";
import Icon from "../stylematch/Icon";
import { exportWardrobe } from "../platform/export";
import { currentLocationWeather, fetchWeather } from "../platform/weather";
import { useAuth } from "./AuthContext";
import { useTheme } from "./theme";
import ColorPairingCard from "./ColorPairingCard";

export function HomeScreen({ navigation }) {
  const { s, colors, dark } = useTheme();

  const { items, profile, history, looks, weather, saveLook, wearLook } =
    useStyleStore();
  const [offset, setOffset] = useState(0);
  const [weatherError, setWeatherError] = useState("");
  useEffect(() => {
    let active = true;
    const previous = useStyleStore.getState().weather;
    const request =
      previous.mode === "city"
        ? fetchWeather(previous)
        : currentLocationWeather();
    request
      .then((next) => {
        if (active && useStyleStore.getState().weather === previous)
          useStyleStore.getState().setWeather(next);
      })
      .catch((error) => {
        if (active) setWeatherError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    setWeatherError("");
  }, [weather]);
  const { width } = useWindowDimensions();
  const wide = width > 850;
  const daily = useMemo(
    () => recommend({ items, profile, history, weather, offset }),
    [items, profile, history, weather, offset],
  );
  const owned = items.filter((i) => i.status === "owned");
  const viewItem = (item) =>
    navigation.navigate("ClothingDetail", { id: item.id });
  return (
    <Screen>
      <View style={s.top}>
        <View style={s.row}>
          <Icon name="sparkle" size={27} />
          <Text style={s.logo}>StyleMatch.</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => navigation.navigate("Profile")}
          style={s.avatar}
        >
          <Text style={s.avatarText}>
            {profile.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </Text>
        </Pressable>
      </View>
      <View style={[s.between, { flexWrap: "wrap", paddingVertical: 10 }]}>
        <Heading
          eyebrow="YOUR STYLE. YOUR ERA."
          title={`Good morning, ${profile.name.split(" ")[0]}`}
          subtitle="Less “what to wear.” More being you."
        />
        <Button
          title="Build my fit"
          icon="sparkle"
          onPress={() => navigation.navigate("Style")}
        />
      </View>
      {!!weatherError && (
        <View style={s.info}>
          <Text style={s.small}>
            {weatherError} Previous weather is shown below.
          </Text>
          <Button
            title="Choose weather location"
            secondary
            onPress={() => navigation.navigate("Weather")}
          />
        </View>
      )}
      <Button
        title="Fit check"
        icon="camera"
        secondary
        onPress={() => navigation.navigate("OutfitCheck")}
      />
      <View style={{ flexDirection: wide ? "row" : "column", gap: 22 }}>
        <View style={{ flex: 1, gap: 23 }}>
          <View style={s.section}>
            <SectionTitle title="Your daily vibe" />
            <View style={s.daily}>
              {owned.length >= 6 && daily.items.length > 0 ? (
                <>
                  <View style={s.dailyHeader}>
                    <Text style={s.eyebrow}>● TODAY’S PICK</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Save today's look"
                      onPress={() => saveLook(daily)}
                      style={s.iconButton}
                    >
                      <Icon
                        name="heart"
                        color={
                          looks.some((l) => l.id === daily.id)
                            ? colors.gold
                            : colors.green
                        }
                      />
                    </Pressable>
                  </View>
                  <View
                    style={[
                      s.dailyBody,
                      { flexDirection: wide ? "row" : "column" },
                    ]}
                  >
                    <OutfitBoard
                      items={daily.items}
                      onItem={viewItem}
                      style={wide && { flex: 1 }}
                    />
                    <View style={[s.dailyDetails, wide && { flex: 1 }]}>
                      <Text style={s.eyebrow}>THE EVERYDAY EDIT / 01</Text>
                      <Text style={[s.title, { fontSize: 28 }]}>
                        Easy layers.{"\n"}Endless possibilities.
                      </Text>
                      <Text style={s.body}>
                        A little texture, a few good neutrals. Your kind of
                        put-together.
                      </Text>
                      <View style={s.wrap}>
                        {[
                          "Casual",
                          "Effortless",
                          `${weather.temperature}° friendly`,
                        ].map((t) => (
                          <Text
                            key={t}
                            style={[
                              s.small,
                              {
                                backgroundColor: colors.bg,
                                padding: 6,
                                borderRadius: 6,
                              },
                            ]}
                          >
                            {t}
                          </Text>
                        ))}
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="See outfit scores"
                        onPress={() =>
                          navigation.navigate("Result", { look: daily })
                        }
                      >
                        <Score value={daily.scores.total} />
                      </Pressable>
                      <Button
                        title="Wear this look"
                        icon="check"
                        onPress={() => wearLook(daily)}
                      />
                      <Button
                        title="Try another"
                        secondary
                        icon="refresh"
                        onPress={() => setOffset((o) => o + 1)}
                      />
                    </View>
                  </View>
                  <View style={s.why}>
                    <Icon name="sparkle" size={18} />
                    <View style={s.fill}>
                      <Text style={s.label}>A little styling insight</Text>
                      <Text style={s.small}>{daily.explanation}</Text>
                    </View>
                  </View>
                </>
              ) : (
                <EmptyState
                  title="Your next great look starts here."
                  description={
                    daily.exhausted
                      ? daily.explanation
                      : daily.gap?.length
                        ? daily.explanation
                        : "Add six pieces, including a top, bottom, and shoes, to unlock your daily outfit."
                  }
                  action={
                    <Button
                      title="Add clothing"
                      icon="plus"
                      onPress={() => navigation.navigate("Clothing")}
                    />
                  }
                />
              )}
            </View>
          </View>
          {owned.length >= 6 && daily.items.length > 0 && (
            <ColorPairingCard look={daily} />
          )}
          <View style={s.section}>
            <SectionTitle
              title={`A peek into your wardrobe · ${items.length}`}
              action="View all"
              onPress={() => navigation.navigate("Wardrobe")}
            />
            <View style={s.grid}>
              {items.slice(0, 4).map((item) => (
                <GarmentCard
                  key={item.id}
                  item={item}
                  width={wide ? "47.7%" : "47.8%"}
                  palette={profile.glowColors}
                  onPress={viewItem}
                />
              ))}
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Style an outfit for an occasion"
            onPress={() => navigation.navigate("Style")}
            style={[s.quiet, s.row]}
          >
            <Icon name="wardrobe" size={30} />
            <View style={s.fill}>
              <Text style={s.eyebrow}>SAME WARDROBE. NEW POSSIBILITIES.</Text>
              <Text style={[s.h3, { marginVertical: 6 }]}>
                A plan for tonight? There’s a look for that.
              </Text>
              <Text style={s.small}>
                A coffee date, a big meeting, or absolutely no plans.
              </Text>
            </View>
            <Icon name="arrow" />
          </Pressable>
        </View>
        <View style={{ width: wide ? 290 : "100%", gap: 20 }}>
          <SectionTitle
            title={
              weather.source === "Open-Meteo"
                ? "Weather at your location"
                : "Sample weather"
            }
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change weather"
            onPress={() => navigation.navigate("Weather")}
            style={s.weather}
          >
            <View style={s.between}>
              <View style={s.row}>
                <Icon name="location" color={colors.weatherMuted} size={15} />
                <Text style={s.weatherMuted}>{weather.location}</Text>
              </View>
              <Text style={[s.eyebrow, { color: colors.weatherMuted }]}>
                DEMO
              </Text>
            </View>
            <View style={s.between}>
              <View>
                <Text style={s.temperature}>{weather.temperature}°</Text>
                <Text style={[s.body, s.light]}>{weather.condition}</Text>
              </View>
              <Icon
                name={weather.condition === "Rainy" ? "cloud-rain" : "sun"}
                size={65}
                color={colors.lime}
              />
            </View>
            <View style={s.row}>
              <Text style={s.weatherMuted}>
                Feels like {weather.feelsLike}°
              </Text>
              <Text style={s.weatherMuted}>Humidity {weather.humidity}%</Text>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#ffffff20",
                paddingTop: 15,
              }}
            >
              <Text style={s.weatherMuted}>
                {weather.temperature < 15
                  ? "A cozy layer kind of day."
                  : weather.condition === "Rainy"
                    ? "Waterproof shoes have your back."
                    : "Light layers. All-day comfort."}
              </Text>
            </View>
          </Pressable>
          <View style={s.card}>
            <Text style={s.eyebrow}>YOUR COLOR STORY</Text>
            <Text style={s.h3}>Colors that feel like you.</Text>
            <Text style={s.small}>Good things happen in your palette.</Text>
            <View style={s.wrap}>
              {profile.glowColors.slice(0, 5).map((name) => (
                <View
                  accessibilityLabel={name}
                  key={name}
                  style={[
                    s.swatch,
                    {
                      backgroundColor: COLORS.find((c) => c.name === name)?.hex,
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={s.small}>
              {profile.undertone} undertone · {profile.tone} depth
            </Text>
            <Button
              title="Explore my colors"
              secondary
              icon="arrow"
              onPress={() =>
                navigation.navigate("Preferences", { paletteOnly: true })
              }
            />
          </View>
          <View
            style={[s.quiet, { alignItems: "center", paddingVertical: 25 }]}
          >
            <Icon name="leaf" size={30} />
            <Text style={s.eyebrow}>LOVE WHAT YOU OWN</Text>
            <Text style={[s.h2, s.centered]}>
              Your best next outfit is already in your closet.
            </Text>
            <Text style={[s.body, s.centered]}>
              Wear more. Buy less. Feel great.
            </Text>
            <View style={s.divider} />
            <Text style={s.small}>
              {owned.length} pieces. So many possibilities.
            </Text>
          </View>
          <Button
            title="Discover a thoughtful addition"
            secondary
            icon="bag"
            onPress={() => navigation.navigate("Discover")}
          />
        </View>
      </View>
      <Text style={[s.eyebrow, s.centered]}>
        THOUGHTFULLY STYLED. UNIQUELY YOU.
      </Text>
    </Screen>
  );
}

export function WardrobeScreen({ navigation }) {
  const { s, colors, dark } = useTheme();

  const { items, profile } = useStyleStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All items");
  const { width } = useWindowDimensions();
  const filtered = items.filter(
    (i) =>
      (category === "All items" || category === i.category) &&
      `${i.name} ${i.color} ${i.brand}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <Screen>
      <Heading
        eyebrow="THE ROTATION"
        title="Your wardrobe. Main character energy."
        subtitle={`${items.length} pieces you love. A world of ways to wear them.`}
      />
      <Button
        title="Add clothing"
        icon="plus"
        onPress={() => navigation.navigate("Clothing")}
      />
      <SearchBar
        accessibilityLabel="Search wardrobe"
        placeholder="Find a favorite piece…"
        value={search}
        onChangeText={setSearch}
      />
      <View style={s.wrap}>
        {CATEGORIES.map((c) => (
          <Chip
            key={c}
            selected={category === c}
            onPress={() => setCategory(c)}
          >
            {c}
          </Chip>
        ))}
      </View>
      {filtered.length ? (
        <View style={s.grid}>
          {filtered.map((item) => (
            <GarmentCard
              key={item.id}
              item={item}
              width={width > 850 ? "23.8%" : "47.8%"}
              onPress={(i) =>
                navigation.navigate("ClothingDetail", { id: i.id })
              }
              palette={profile.glowColors}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          title="A little room for something good."
          description="Try another search or add a piece to your wardrobe."
          action={
            <Button
              title="Add your first piece"
              onPress={() => navigation.navigate("Clothing")}
            />
          }
        />
      )}
    </Screen>
  );
}

export function LooksScreen({ navigation }) {
  const { s, colors, dark } = useTheme();

  const { looks, history } = useStyleStore();
  const [historyTab, setHistoryTab] = useState(false);
  const [filter, setFilter] = useState("All");
  const { width } = useWindowDimensions();
  const filtered = (historyTab ? history : looks).filter(
    (l) => filter === "All" || l.occasion === filter,
  );
  return (
    <Screen>
      <Heading
        eyebrow="YOUR STYLE, COLLECTED"
        title="Saved fits. Endless inspo."
        subtitle="Your favorite combinations, ready for their next outing."
      />
      <View style={s.wrap}>
        <Chip selected={!historyTab} onPress={() => setHistoryTab(false)}>
          Saved looks {looks.length}
        </Chip>
        <Chip selected={historyTab} onPress={() => setHistoryTab(true)}>
          Outfit history {history.length}
        </Chip>
      </View>
      <View style={s.wrap}>
        {["All", ...OCCASIONS].map((o) => (
          <Chip key={o} selected={filter === o} onPress={() => setFilter(o)}>
            {o}
          </Chip>
        ))}
      </View>
      {filtered.length ? (
        <View style={s.grid}>
          {filtered.map((look, index) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`View ${look.name}`}
              key={`${look.id}-${index}`}
              onPress={() => navigation.navigate("Result", { look })}
              style={[
                s.card,
                { width: width > 700 ? "48%" : "100%", padding: 12 },
              ]}
            >
              <OutfitBoard items={look.items} />
              <View style={{ padding: 7, gap: 10 }}>
                <Text style={s.eyebrow}>
                  {look.occasion.toUpperCase()} · {look.mood.toUpperCase()}
                </Text>
                <Text style={s.h3}>{look.name}</Text>
                <Score value={look.scores.total} />
                <Text style={s.small}>
                  {historyTab
                    ? new Date(look.wornOn).toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })
                    : `${look.items.length} pieces · your own wardrobe`}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <EmptyState
          icon={historyTab ? "clock" : "heart"}
          title={
            historyTab
              ? "Make today a good outfit day."
              : "Keep a little inspiration."
          }
          description={
            historyTab
              ? "Wear a look to start your outfit history."
              : "Save a look you love. It’ll be waiting right here."
          }
          action={
            <Button
              title="Create a look"
              icon="sparkle"
              onPress={() => navigation.navigate("Style")}
            />
          }
        />
      )}
    </Screen>
  );
}

export function ProfileScreen({ navigation }) {
  const { s, colors, dark } = useTheme();

  const auth = useAuth();
  const state = useStyleStore();
  const { profile, items, looks } = state;
  const [deleting, setDeleting] = useState(false);
  const exportData = async () => {
    try {
      const { items, profile, looks, history, weather } = state;
      await exportWardrobe({ items, profile, looks, history, weather });
      state.notify("Your wardrobe export is ready.");
    } catch (error) {
      state.notify(error.message || "Could not export your wardrobe.");
    }
  };
  return (
    <Screen>
      <Heading
        eyebrow="PERSONAL, BY DESIGN"
        title="A style story that’s yours."
        subtitle="A few little details. A much more personal wardrobe."
      />
      <View style={[s.card, { alignItems: "center", paddingVertical: 30 }]}>
        <View style={[s.avatar, { width: 76, height: 76, borderRadius: 38 }]}>
          <Text style={[s.avatarText, { fontSize: 25 }]}>
            {profile.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </Text>
        </View>
        <Text style={s.h2} translate={false}>
          {profile.name}
        </Text>
        <Text style={s.small}>
          {auth?.session?.user.email || "Guest profile"} · saved on this device
        </Text>
        <Button
          title={auth?.session ? "Account & logout" : "Log in / create account"}
          secondary
          onPress={() => navigation.navigate("Account")}
        />
        <View
          style={[
            s.row,
            { justifyContent: "space-around", width: "100%", marginTop: 12 },
          ]}
        >
          {[
            [items.length, "Pieces"],
            [looks.length, "Saved looks"],
            [
              looks.length
                ? `${Math.round(looks.reduce((sum, look) => sum + look.scores.total, 0) / looks.length)}%`
                : "—",
              "Avg. match",
            ],
          ].map(([value, label]) => (
            <View key={label} style={{ alignItems: "center", gap: 5 }}>
              <Text style={s.h2}>{value}</Text>
              <Text style={s.small}>{label}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={s.card}>
        <Text style={s.h3}>Your style DNA</Text>
        {[
          [
            "Skin tone & undertone",
            `${profile.tone === "Light" ? "Light skin" : profile.tone} · ${profile.undertone}`,
          ],
          ["Preferred styles", profile.styles.join(", ") || "Not selected"],
          [
            "Glow colors",
            profile.glowColors.join(", ") || "Choose your colors",
          ],
        ].map(([label, value]) => (
          <Pressable
            key={label}
            accessibilityRole="button"
            onPress={() => navigation.navigate("Preferences")}
            style={s.preference}
          >
            <View style={s.fill}>
              <Text style={s.label}>{label}</Text>
              <Text style={s.small}>{value}</Text>
            </View>
            <Icon name="chevron" size={17} />
          </Pressable>
        ))}
        <Button
          title="Edit preferences"
          secondary
          icon="edit"
          onPress={() => navigation.navigate("Preferences")}
        />
      </View>
      <View style={s.weather}>
        <Icon name="sparkle" size={30} color={colors.sky} />
        <Text style={[s.h2, s.light]}>Good style gets more personal.</Text>
        <Text style={s.weatherMuted}>
          Your saved looks and worn pieces help keep your recommendations fresh.
        </Text>
      </View>
      <View style={s.card}>
        <Text style={s.h3}>The little details</Text>
        <Button
          title="App settings"
          icon="settings"
          secondary
          onPress={() => navigation.navigate("Settings")}
        />
        <Button
          title="Explore your color palette"
          secondary
          icon="camera"
          onPress={() => navigation.navigate("ColorIntro")}
        />
        <Button
          title="Export my wardrobe"
          secondary
          icon="download"
          onPress={exportData}
        />
        <Button
          title="Discover new pieces"
          secondary
          icon="bag"
          onPress={() => navigation.navigate("Discover")}
        />
        <Button
          title="Delete my data"
          secondary
          icon="trash"
          onPress={() => setDeleting(true)}
        />
        <Text style={s.small}>
          Export a copy before clearing app storage or reinstalling. Cloud
          wardrobe sync is not enabled.
        </Text>
      </View>
      <Confirm
        visible={deleting}
        title="A fresh start?"
        description="Delete your wardrobe, saved looks, history, and preferences from this device? Export a copy first if you want to keep it."
        action="Delete my data"
        onClose={() => setDeleting(false)}
        onConfirm={async () => {
          await state.deleteData();
          setDeleting(false);
          navigation.navigate("Home");
        }}
      />
    </Screen>
  );
}

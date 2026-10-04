// Platform-independent outfit rules, shared by iOS, Android, and web.
export const outfitKey = (items) =>
  items
    .map((i) => i.id)
    .sort()
    .join("|");
export function recommend({
  items,
  profile,
  weather,
  occasion = "Casual",
  mood = "Effortless",
  history = [],
  offset = 0,
  lockedId,
  formality = 1,
  relaxDressCode = false,
}) {
  const formal =
    !relaxDressCode &&
    (["Wedding", "Party"].includes(occasion) || formality >= 3);
  const owned = items.filter((i) => i.status === "owned");
  const eligible = owned.filter(
    (i) =>
      (!formal || i.formal >= 2) &&
      (relaxDressCode ||
        formality !== 2 ||
        i.category === "Shoes" ||
        i.formal >= 2) &&
      (weather.temperature <= 28 || i.category !== "Jackets") &&
      (weather.condition !== "Rainy" || i.category !== "Shoes" || i.waterproof),
  );
  const groups = ["Tops", "Bottoms", "Shoes"].map((category) =>
    eligible.filter((i) => i.category === category),
  );
  if (formal) groups[2] = groups[2].filter((i) => i.formal >= 3);
  const layers = eligible.filter((i) => i.category === "Jackets");
  const missing = ["Tops", "Bottoms", "Shoes"].filter(
    (_, index) => !groups[index].length,
  );
  if (weather.temperature < 15 && !layers.length) missing.push("Jackets");
  if (missing.length)
    return {
      gap: missing,
      occasion,
      mood,
      items: [],
      weather,
      explanation: `Add ${missing.join(" and ").toLowerCase()} that suit ${occasion.toLowerCase()} and the weather to complete this look.`,
    };
  const recent = new Set(
    history
      .filter((h) => Date.now() - new Date(h.wornOn).getTime() < 7 * 86400000)
      .map((h) => outfitKey(h.items)),
  );
  const candidates = [];
  for (const top of groups[0])
    for (const bottom of groups[1])
      for (const shoes of groups[2]) {
        // Consider layers individually so locked pieces and repeat avoidance remain accurate.
        const options =
          weather.temperature < 15
            ? layers
            : weather.temperature <= 26
              ? [null, ...layers]
              : [null];
        for (const layer of options) {
          const combo = [top, bottom, shoes, ...(layer ? [layer] : [])];
          const lockedAccessory = owned.find(
            (i) => i.id === lockedId && i.category === "Accessories",
          );
          if (lockedAccessory) combo.push(lockedAccessory);
          if (lockedId && !combo.some((i) => i.id === lockedId)) continue;
          if (recent.has(outfitKey(combo))) continue;
          const mean = (fn) =>
            Math.round(
              combo.reduce((sum, item) => sum + fn(item), 0) / combo.length,
            );
          const scores = {
            skinTone: mean((i) =>
              profile.avoidColors.includes(i.color)
                ? 40
                : profile.glowColors.includes(i.color)
                  ? 99
                  : ["White", "Navy"].includes(i.color)
                    ? 88
                    : 72,
            ),
            occasion: mean((i) =>
              formal
                ? i.formal >= 3
                  ? 99
                  : 85
                : ["Office", "Date"].includes(occasion)
                  ? i.formal >= 2
                    ? 98
                    : 76
                  : i.formal <= 2
                    ? 98
                    : 83,
            ),
            weather: layer
              ? weather.temperature <= 24
                ? 98
                : 85
              : weather.temperature < 18
                ? 80
                : 95,
            mood: mean((i) =>
              mood === "Bold"
                ? ["Terracotta", "Teal"].includes(i.color)
                  ? 99
                  : 79
                : mood === "Minimal"
                  ? ["White", "Cream", "Navy", "Black", "Camel"].includes(
                      i.color,
                    )
                    ? 99
                    : 80
                  : profile.styles.includes(i.style)
                    ? 98
                    : 89,
            ),
          };
          scores.total = Math.round(
            scores.skinTone * 0.3 +
              scores.occasion * 0.3 +
              scores.weather * 0.25 +
              scores.mood * 0.15,
          );
          const freshness = mean((i) =>
            !i.lastWornAt
              ? 2
              : Math.min(
                  2,
                  (Date.now() - new Date(i.lastWornAt).getTime()) /
                    86400000 /
                    7,
                ),
          );
          candidates.push({
            items: combo,
            scores,
            rank: scores.total + freshness,
            occasion,
            mood,
            weather,
          });
        }
      }
  candidates.sort((a, b) => b.rank - a.rank);
  if (!candidates.length)
    return {
      items: [],
      gap: [],
      exhausted: true,
      occasion,
      mood,
      weather,
      explanation: lockedId
        ? "This piece cannot complete a fresh look for these settings. Try another occasion or add a complementary piece."
        : "You’ve worn every matching combination this week. Add a piece or change the occasion to discover a fresh look.",
    };
  const result = candidates[offset % candidates.length];
  const names = {
    Casual: "The everyday edit",
    Office: "Your next power move",
    Date: "A little after hours",
    Wedding: "An occasion to remember",
    Party: "Make an entrance",
    Travel: "Out of office",
  };
  return {
    ...result,
    id: outfitKey(result.items),
    name: names[occasion],
    explanation: `${result.items[0].color} and ${result.items[1].color.toLowerCase()} bring a balanced feel to your ${occasion.toLowerCase()} look. ${result.items.length > 3 ? "A light layer adds texture" : "A simple silhouette keeps things effortless"} at ${weather.temperature}°C, with ${result.items[2].name.toLowerCase()} to finish.`,
  };
}
export async function createOutfit(options) {
  await new Promise((resolve) => setTimeout(resolve, 1400));
  return recommend(options);
}

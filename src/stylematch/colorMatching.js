import { COLORS } from "./data";

export const COLOR_APPROACHES = ["Balanced", "Tonal", "Bold contrast"];

// These are styling heuristics, not a Pinterest model or an objective beauty rating.
export function normalizeHex(value) {
  if (typeof value !== "string") return null;
  const match = value.trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/i);
  if (!match) return null;
  const hex =
    match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1];
  return `#${hex.toUpperCase()}`;
}

export function getColorHex(item) {
  return (
    normalizeHex(item?.colorHex) ||
    normalizeHex(COLORS.find((c) => c.name === item?.color)?.hex)
  );
}

function toHsl(hex) {
  const [r, g, b] = [1, 3, 5].map(
    (index) => parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  if (delta) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue = (hue * 60 + 360) % 360;
  }
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  return { hue, saturation, lightness };
}

export function matchClothingColors(top, bottom, approach = "Balanced") {
  const topHex = getColorHex(top),
    bottomHex = getColorHex(bottom);
  if (!topHex || !bottomHex)
    return {
      available: false,
      score: null,
      label: "Color details needed",
      topHex,
      bottomHex,
      approach,
      explanation:
        "Add a valid HEX color to both pieces to compare their colors.",
    };
  const a = toHsl(topHex),
    b = toHsl(bottomHex);
  const difference = Math.abs(a.hue - b.hue);
  const hueDistance = Math.min(difference, 360 - difference);
  const lightnessDistance = Math.abs(a.lightness - b.lightness);
  const isNeutral = (c) =>
    c.saturation < 0.18 || c.lightness > 0.82 || c.lightness < 0.12;
  const neutrals = Number(isNeutral(a)) + Number(isNeutral(b));
  let score, label, explanation;
  if (neutrals) {
    label = neutrals === 2 ? "Neutral balance" : "A neutral foundation";
    score = lightnessDistance > 0.2 ? 95 : 88;
    explanation =
      neutrals === 2
        ? lightnessDistance > 0.1
          ? "These neutral shades keep the outfit understated; differences in depth give the two pieces definition."
          : "These similar neutral shades create a quiet, coordinated look. Try different fabric textures for definition."
        : "One shade acts as a neutral, giving the other color room to stand out.";
    if (approach === "Tonal") score = lightnessDistance < 0.3 ? 96 : 84;
    if (approach === "Bold contrast") score = lightnessDistance > 0.4 ? 95 : 80;
  } else if (hueDistance <= 25) {
    label = "Tonal harmony";
    score = approach === "Tonal" ? 97 : approach === "Bold contrast" ? 76 : 91;
    explanation =
      "These shades share a similar hue, creating a coordinated top-to-bottom look.";
  } else if (hueDistance <= 65) {
    label = "Neighboring colors";
    score = approach === "Tonal" ? 93 : approach === "Bold contrast" ? 80 : 92;
    explanation =
      "Nearby hues on the color wheel give these two pieces a soft, connected feel.";
  } else if (hueDistance >= 150) {
    label = "Complementary contrast";
    score = approach === "Bold contrast" ? 97 : approach === "Tonal" ? 64 : 88;
    explanation =
      "These hues sit opposite each other on the color wheel, making the pairing feel more expressive.";
  } else {
    label = "Playful contrast";
    score = approach === "Bold contrast" ? 90 : approach === "Tonal" ? 70 : 80;
    explanation =
      "These different hues bring a more colorful feel than a neutral or tonal combination.";
  }
  return {
    available: true,
    score,
    label,
    explanation,
    topHex,
    bottomHex,
    approach,
  };
}

export function outfitColorPairing(items, approach = "Balanced") {
  const top = items.find((item) => item.category === "Tops");
  const bottom = items.find((item) => item.category === "Bottoms");
  return top && bottom
    ? { ...matchClothingColors(top, bottom, approach), top, bottom }
    : null;
}

// Only generic style terms leave the device when the user opens this link.
// Names, photos, personal palette/skin data, and clothing HEX codes are never sent.
export function pinterestInspirationUrl(items, occasion = "Casual") {
  const top = items.find((i) => i.category === "Tops");
  const bottom = items.find((i) => i.category === "Bottoms");
  if (!top || !bottom) return null;
  const safeColor = (item) =>
    COLORS.some((c) => c.name === item.color)
      ? item.color.toLowerCase()
      : "color coordinated";
  const topType =
    { shirt: "shirt", tshirt: "t-shirt", sweater: "sweater" }[top.type] ||
    "top";
  const occasionTerm = [
    "Casual",
    "Office",
    "Date",
    "Wedding",
    "Party",
    "Travel",
  ].includes(occasion)
    ? occasion.toLowerCase()
    : "casual";
  return `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(`${safeColor(top)} ${topType} ${safeColor(bottom)} trousers ${occasionTerm} outfit color combination`)}`;
}

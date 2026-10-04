import { outfitColorPairing } from "./colorMatching";
export const ESSENTIALS = ["Tops", "Bottoms", "Shoes"];
export function checkOutfit(items, weather, occasion = "Casual") {
  const gaps = ESSENTIALS.filter(
    (category) => !items.some((item) => item.category === category),
  );
  const notes = [];
  const replacements = [];
  const pairing = outfitColorPairing(items);
  if (pairing?.available) notes.push(pairing.explanation);
  if (
    weather.temperature < 15 &&
    !items.some((item) => item.category === "Jackets")
  ) {
    gaps.push("Jackets");
    notes.push("A warm layer would help in this weather.");
  }
  if (
    ["Rainy", "Snowy", "Thunderstorms"].includes(weather.condition) &&
    items.some((item) => item.category === "Shoes" && !item.waterproof)
  ) {
    replacements.push("Shoes");
    notes.push("Try waterproof footwear for these conditions.");
  }
  if (["Wedding", "Party", "Office"].includes(occasion)) {
    const casual = items.filter(
      (item) =>
        ESSENTIALS.includes(item.category) &&
        item.formal <
          (item.category === "Shoes" && occasion === "Wedding" ? 3 : 2),
    );
    for (const item of casual) replacements.push(item.category);
    if (casual.length)
      notes.push(
        "For this occasion, you may prefer a more dressed-up version of the selected pieces.",
      );
  }
  if (pairing?.score < 85) {
    replacements.push("Bottoms");
    notes.push(
      "A tonal or neutral bottom is one option if you want a calmer color pairing.",
    );
  }
  if (!notes.length)
    notes.push("Choose a top and bottom to compare their colors.");
  return { gaps, suggestions: [...new Set([...gaps, ...replacements])], notes };
}
export const BRAND_LINKS = [
  {
    name: "UNIQLO",
    categories: ["Tops", "Bottoms", "Jackets"],
    url: "https://www.uniqlo.com/",
  },
  {
    name: "MANGO",
    categories: ["Tops", "Bottoms", "Jackets", "Shoes"],
    url: "https://shop.mango.com/",
  },
  { name: "Clarks", categories: ["Shoes"], url: "https://www.clarks.com/" },
  { name: "Nike", categories: ["Shoes"], url: "https://www.nike.com/" },
];

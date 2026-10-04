import { checkOutfit } from "./outfitCheck";
test("manual looks identify missing pieces, weather needs, and occasion replacements", () => {
  const items = [
    { category: "Tops", color: "White", formal: 1 },
    { category: "Shoes", color: "White", formal: 1, waterproof: false },
  ];
  const result = checkOutfit(
    items,
    { temperature: 10, condition: "Snowy" },
    "Wedding",
  );
  expect(result.gaps).toEqual(["Bottoms", "Jackets"]);
  expect(result.suggestions).toEqual(
    expect.arrayContaining(["Bottoms", "Jackets", "Shoes", "Tops"]),
  );
});
test("complete neutral casual outfit does not require a purchase", () => {
  const items = ["Tops", "Bottoms", "Shoes"].map((category) => ({
    category,
    color: "White",
    formal: 2,
  }));
  expect(
    checkOutfit(items, { temperature: 24, condition: "Sunny" }).suggestions,
  ).toEqual([]);
});

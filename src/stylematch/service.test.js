import { recommend, outfitKey } from "./service";
import { INITIAL_ITEMS, INITIAL_PROFILE, DEMO_WEATHER } from "./data";
const options = {
  items: INITIAL_ITEMS,
  profile: INITIAL_PROFILE,
  weather: DEMO_WEATHER,
};

test("recommendations contain owned essentials and the weighted score is correct", () => {
  const result = recommend(options);
  expect(result.items.map((i) => i.category)).toEqual(
    expect.arrayContaining(["Tops", "Bottoms", "Shoes"]),
  );
  expect(result.items.every((i) => i.status === "owned")).toBe(true);
  const s = result.scores;
  expect(s.total).toBe(
    Math.round(
      s.skinTone * 0.3 + s.occasion * 0.3 + s.weather * 0.25 + s.mood * 0.15,
    ),
  );
});
test("incoming shoes cannot fill a missing category", () => {
  const items = INITIAL_ITEMS.map((i) =>
    i.category === "Shoes" ? { ...i, status: "incoming" } : i,
  );
  expect(recommend({ ...options, items }).gap).toContain("Shoes");
});
test("hot weather excludes jackets, cold weather requires a layer", () => {
  expect(
    recommend({
      ...options,
      weather: { ...DEMO_WEATHER, temperature: 32 },
    }).items.some((i) => i.category === "Jackets"),
  ).toBe(false);
  expect(
    recommend({
      ...options,
      weather: { ...DEMO_WEATHER, temperature: 10 },
    }).items.some((i) => i.category === "Jackets"),
  ).toBe(true);
  expect(
    recommend({
      ...options,
      items: INITIAL_ITEMS.filter((i) => i.category !== "Jackets"),
      weather: { ...DEMO_WEATHER, temperature: 10 },
    }).gap,
  ).toContain("Jackets");
});
test("rain requires owned waterproof footwear", () => {
  const result = recommend({
    ...options,
    weather: { ...DEMO_WEATHER, condition: "Rainy" },
  });
  expect(result.items.find((i) => i.category === "Shoes").waterproof).toBe(
    true,
  );
  expect(
    recommend({
      ...options,
      items: INITIAL_ITEMS.filter((i) => !i.waterproof),
      weather: { ...DEMO_WEATHER, condition: "Rainy" },
    }).gap,
  ).toContain("Shoes");
});
test("formal outfits need appropriate shoes and restyling can relax the dress code", () => {
  const items = INITIAL_ITEMS.filter((i) => i.id !== "boot-camel");
  expect(recommend({ ...options, items, occasion: "Wedding" }).gap).toContain(
    "Shoes",
  );
  const restyled = recommend({
    ...options,
    items,
    occasion: "Wedding",
    relaxDressCode: true,
  });
  expect(restyled.items.length).toBeGreaterThanOrEqual(3);
  expect(restyled.items.every((i) => i.status === "owned")).toBe(true);
});
test("seven-day repeat avoidance ignores order and expires older history", () => {
  const first = recommend(options);
  const recent = {
    ...first,
    items: [...first.items].reverse(),
    wornOn: new Date().toISOString(),
  };
  expect(
    outfitKey(recommend({ ...options, history: [recent] }).items),
  ).not.toBe(outfitKey(first.items));
  const old = {
    ...recent,
    wornOn: new Date(Date.now() - 8 * 86400000).toISOString(),
  };
  expect(outfitKey(recommend({ ...options, history: [old] }).items)).toBe(
    outfitKey(first.items),
  );
});
test("locked pieces are included or an honest empty result is returned", () => {
  expect(
    recommend({ ...options, lockedId: "shirt-teal" }).items.map((i) => i.id),
  ).toContain("shirt-teal");
  expect(
    recommend({ ...options, lockedId: "bag-camel" }).items.map((i) => i.id),
  ).toContain("bag-camel");
  expect(
    recommend({
      ...options,
      lockedId: "jacket-olive",
      weather: { ...DEMO_WEATHER, temperature: 35 },
    }).exhausted,
  ).toBe(true);
});
test("an exhausted wardrobe never silently repeats a recent outfit", () => {
  const items = INITIAL_ITEMS.slice(0, 3);
  const first = recommend({ ...options, items });
  expect(
    recommend({
      ...options,
      items,
      history: [{ ...first, wornOn: new Date().toISOString() }],
    }).exhausted,
  ).toBe(true);
});

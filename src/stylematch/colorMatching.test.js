import {
  normalizeHex,
  getColorHex,
  matchClothingColors,
  outfitColorPairing,
  pinterestInspirationUrl,
} from "./colorMatching";
const shade = (colorHex) => ({ colorHex });
test("HEX inputs normalize shorthand and reject invalid or unsafe values", () => {
  expect(normalizeHex(" #aBc ")).toBe("#AABBCC");
  expect(normalizeHex("ff0088")).toBe("#FF0088");
  for (const value of [
    "",
    "#12345",
    "#12345678",
    "red",
    "#GGGGGG",
    null,
    123,
    "url(x)",
  ])
    expect(normalizeHex(value)).toBeNull();
  expect(getColorHex({ color: "Navy", colorHex: "#abc" })).toBe("#AABBCC");
  expect(getColorHex({ color: "White" })).toMatch(/^#[\dA-F]{6}$/);
  expect(matchClothingColors({}, shade("#abc")).available).toBe(false);
});
test("tonal and bold choices favor different color relationships, including hue wraparound", () => {
  const red = shade("#FF0000"),
    nearRed = shade("#FF0022"),
    cyan = shade("#00FFFF");
  expect(matchClothingColors(red, nearRed).label).toBe("Tonal harmony");
  expect(matchClothingColors(red, cyan).label).toBe("Complementary contrast");
  expect(matchClothingColors(red, nearRed, "Tonal").score).toBeGreaterThan(
    matchClothingColors(red, cyan, "Tonal").score,
  );
  expect(matchClothingColors(red, cyan, "Bold contrast").score).toBeGreaterThan(
    matchClothingColors(red, nearRed, "Bold contrast").score,
  );
  expect(matchClothingColors(shade("#000"), shade("#fff")).label).toBe(
    "Neutral balance",
  );
});
test("saved legacy looks resolve colors and Pinterest uses only generic search terms", () => {
  const items = [
    {
      category: "Tops",
      type: "shirt",
      color: "Navy",
      name: "Private top",
      image: "private-photo",
      colorHex: "#112233",
    },
    { category: "Bottoms", color: "Cream", name: "Private trousers" },
  ];
  expect(outfitColorPairing(items).available).toBe(true);
  const url = new URL(pinterestInspirationUrl(items, "Office"));
  expect(url.origin).toBe("https://www.pinterest.com");
  expect(url.searchParams.get("q")).toBe(
    "navy shirt cream trousers office outfit color combination",
  );
  expect(pinterestInspirationUrl(items)).not.toMatch(/Private|private|112233/);
  expect(
    pinterestInspirationUrl(
      [{ ...items[0], color: "private-color", type: "private-type" }, items[1]],
      "private-occasion",
    ),
  ).not.toContain("private");
  expect(pinterestInspirationUrl([])).toBeNull();
  expect(outfitColorPairing([items[0]])).toBeNull();
});

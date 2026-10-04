import { analyzeOutfit } from "./outfitAnalysis";
test("non-JSON gateway errors give a useful retry message", async () => {
  const original = process.env.EXPO_PUBLIC_STYLE_API_URL;
  process.env.EXPO_PUBLIC_STYLE_API_URL = "https://analysis.example.test";
  const mock = jest.spyOn(global, "fetch").mockResolvedValue({
    ok: false,
    json: async () => {
      throw new SyntaxError("Unexpected <");
    },
  });
  try {
    await expect(
      analyzeOutfit({
        image: "data:image/png;base64,AA==",
        occasion: "Casual",
        items: [],
        token: "synthetic-token",
      }),
    ).rejects.toThrow("Outfit check unavailable. Please retry.");
  } finally {
    mock.mockRestore();
    if (original === undefined) delete process.env.EXPO_PUBLIC_STYLE_API_URL;
    else process.env.EXPO_PUBLIC_STYLE_API_URL = original;
  }
});

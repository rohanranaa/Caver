import { useSettings } from "../native/settings";
export const analysisConfigured = Boolean(
  process.env.EXPO_PUBLIC_STYLE_API_URL,
);
export async function analyzeOutfit({ image, occasion, items, token }) {
  const endpoint = process.env.EXPO_PUBLIC_STYLE_API_URL;
  if (!endpoint)
    throw new Error(
      "Photo analysis is not connected yet. You can still check your selected pieces below.",
    );
  if (!token) throw new Error("Log in to request an AI outfit check.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(
      `${endpoint.replace(/\/$/, "")}/api/outfit-check`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image,
          language: useSettings.getState().language,
          occasion,
          items: items.map(({ category, color }) => ({ category, color })),
        }),
      },
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(
        result.error || "Outfit check unavailable. Please retry.",
      );
    if (
      typeof result.summary !== "string" ||
      !Array.isArray(result.tips) ||
      !Array.isArray(result.suggestions)
    )
      throw new Error("The analysis was incomplete. Please retry.");
    return result;
  } catch (e) {
    if (e.name === "AbortError")
      throw new Error("The outfit check timed out. Please try again.");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export async function analyzePhoto({ image, kind, token }) {
  const endpoint = process.env.EXPO_PUBLIC_STYLE_API_URL;
  if (!endpoint) throw new Error("Photo analysis is not connected yet.");
  if (!token) throw new Error("Log in for AI analysis");
  const route = { clothing: "clothing-tags", skin: "skin-palette" }[kind];
  if (!route) throw new Error("Unsupported analysis");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(
      `${endpoint.replace(/\/$/, "")}/api/${route}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image,
          language: useSettings.getState().language,
        }),
      },
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(
        result?.error || "Photo analysis unavailable. Please retry.",
      );
    if (typeof result?.detected !== "boolean")
      throw new Error("The analysis was incomplete. Please retry.");
    return result;
  } catch (error) {
    if (error.name === "AbortError")
      throw new Error("The photo check timed out. Please try again.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

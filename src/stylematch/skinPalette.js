export const SKIN_SHADES = [
  { id: "S01", hex: "#F6E3D3", tone: "Very light" },
  { id: "S02", hex: "#EED2BB", tone: "Very light" },
  { id: "S03", hex: "#E2BA97", tone: "Light" },
  { id: "S04", hex: "#D8AC88", tone: "Light" },
  { id: "S05", hex: "#C39470", tone: "Medium" },
  { id: "S06", hex: "#B38460", tone: "Medium" },
  { id: "S07", hex: "#A16E4D", tone: "Tan" },
  { id: "S08", hex: "#875537", tone: "Tan" },
  { id: "S09", hex: "#69432F", tone: "Deep" },
  { id: "S10", hex: "#492F24", tone: "Deep" },
];
// Optional styling preferences, not measurements or universal flatteringness.
export function suggestedPalette(tone, undertone) {
  const warm = ["Cream", "Olive", "Terracotta", "Camel", "Teal"];
  const cool = ["Blue", "Navy", "Teal", "White", "Grey"];
  const glow =
    undertone === "Warm"
      ? warm
      : undertone === "Cool"
        ? cool
        : ["Cream", "Teal", "Navy", "Terracotta"];
  const compare =
    undertone === "Warm"
      ? ["Grey", "White"]
      : undertone === "Cool"
        ? ["Camel", "Terracotta"]
        : [];
  const contrast = ["Very light", "Light"].includes(tone)
    ? "Navy"
    : tone === "Deep"
      ? "Cream"
      : "Teal";
  return {
    glowColors: [...new Set([contrast, ...glow])],
    compareColors: compare.filter(
      (color) => !glow.includes(color) && color !== contrast,
    ),
  };
}

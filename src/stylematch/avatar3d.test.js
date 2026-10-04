import { buildAvatar, projectAvatar } from "./avatar3d";
const outfit = [
  { category: "Tops", type: "tshirt", colorHex: "#3A4EFB" },
  { category: "Bottoms", type: "skirt", colorHex: "#E3FF3B" },
  { category: "Shoes", type: "boots", colorHex: "#252943" },
  { category: "Accessories", type: "hat", colorHex: "#33A4FA" },
];
test("3D geometry follows outfit colors and silhouettes and remains finite through rotation", () => {
  const mesh = buildAvatar(outfit, { skin: "#C39470", shape: "Curved" });
  for (const part of ["skirt", "boot", "hat", "top"])
    expect(mesh.some((face) => face.part === part)).toBe(true);
  expect(mesh.find((face) => face.part === "top").color).toBe("#3A4EFB");
  expect(mesh.find((face) => face.part === "skirt").color).toBe("#E3FF3B");
  const front = projectAvatar(mesh, 0);
  expect(projectAvatar(mesh, 360).map((p) => p.points)).toEqual(
    front.map((p) => p.points),
  );
  expect(projectAvatar(mesh, 90).map((p) => p.points)).not.toEqual(
    front.map((p) => p.points),
  );
  for (const angle of [-90, 0, 90, 180, 360]) {
    const view = projectAvatar(mesh, angle, 1.2);
    expect(
      view.every(
        (p) => !/NaN|Infinity/.test(p.points) && /^#[a-f0-9]{6}$/.test(p.fill),
      ),
    ).toBe(true);
    expect(
      view.every((p, index) => !index || view[index - 1].depth <= p.depth),
    ).toBe(true);
  }
});
test("shape and skin personalization change geometry without mutating outfit colors", () => {
  const before = JSON.stringify(outfit);
  const straight = buildAvatar(outfit, { shape: "Straight", skin: "#F6E3D3" });
  const broad = buildAvatar(outfit, { shape: "Broad", skin: "#492F24" });
  expect(broad.find((p) => p.part === "head").color).toBe("#492F24");
  expect(straight.find((p) => p.part === "top").vertices).not.toEqual(
    broad.find((p) => p.part === "top").vertices,
  );
  expect(JSON.stringify(outfit)).toBe(before);
});

test("covered limbs are omitted so skin does not render through trousers", () => {
  const mesh = buildAvatar([
    { category: "Bottoms", type: "trousers", colorHex: "#252943" },
  ]);
  expect(mesh.some((face) => face.part === "leg")).toBe(false);
  const shorts = buildAvatar([
    { category: "Bottoms", type: "shorts", colorHex: "#252943" },
  ]);
  expect(shorts.some((face) => face.part === "leg")).toBe(true);
  expect(
    shorts
      .filter((face) => face.part === "leg")
      .every((face) => face.vertices.every((point) => point[1] <= 1.96)),
  ).toBe(true);
});

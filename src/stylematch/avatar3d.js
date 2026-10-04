import { getColorHex, normalizeHex } from "./colorMatching";

export const BODY_SHAPES = {
  Straight: { shoulder: 0.72, waist: 0.58, hip: 0.62 },
  Curved: { shoulder: 0.69, waist: 0.51, hip: 0.76 },
  Broad: { shoulder: 0.88, waist: 0.66, hip: 0.68 },
};

// A small, real 3D mesh rendered by projecting its vertices into SVG.
// All geometry is local and illustrative; it is not a body scan or cloth simulation.
export function buildAvatar(
  items = [],
  { shape = "Straight", skin = "#C39470" } = {},
) {
  const body = BODY_SHAPES[shape] || BODY_SHAPES.Straight;
  skin = normalizeHex(skin) || "#C39470";
  const faces = [];
  const segments = 16;
  function rings(levels, color, part) {
    const vertices = levels.map(([x, y, z, rx, rz]) =>
      Array.from({ length: segments }, (_, i) => {
        const angle = (i / segments) * Math.PI * 2;
        return [x + Math.cos(angle) * rx, y, z + Math.sin(angle) * rz];
      }),
    );
    for (let row = 0; row < vertices.length - 1; row++) {
      for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;
        faces.push({
          vertices: [
            vertices[row][i],
            vertices[row + 1][i],
            vertices[row + 1][next],
            vertices[row][next],
          ],
          color,
          part,
        });
      }
    }
    faces.push({ vertices: vertices[0], color, part });
    faces.push({
      vertices: [...vertices[vertices.length - 1]].reverse(),
      color,
      part,
    });
  }
  function ellipsoid(x, y, z, rx, ry, rz, color, part, bands = 8) {
    rings(
      Array.from({ length: bands + 1 }, (_, i) => {
        const latitude = -Math.PI / 2 + (i / bands) * Math.PI;
        return [
          x,
          y + Math.sin(latitude) * ry,
          z,
          Math.max(0.001, Math.cos(latitude) * rx),
          Math.max(0.001, Math.cos(latitude) * rz),
        ];
      }),
      color,
      part,
    );
  }
  const garment = (category) =>
    items.find((item) => item.category === category);
  const top = garment("Tops"),
    bottom = garment("Bottoms"),
    jacket = garment("Jackets"),
    shoes = garment("Shoes");
  const fabric = (item) => getColorHex(item) || "#DEE0ED";
  // Neutral underlayers remain visible when an outfit category is missing.
  const upper = jacket || top;
  const upperColor = upper ? fabric(upper) : "#DEE0ED";
  const lowerColor = bottom ? fabric(bottom) : "#727A92";
  const hem = jacket?.type === "coat" ? 2.35 : 3.1;
  const extra = jacket ? 0.09 : 0;
  rings(
    [
      [0, hem, 0, body.hip + extra, 0.36 + extra],
      [0, 3.65, 0, body.waist + extra, 0.33 + extra],
      [0, 4.72, 0, body.shoulder + extra, 0.4 + extra],
      [0, 5.0, 0, body.shoulder * 0.84 + extra, 0.31 + extra],
      [0, 5.08, 0, 0.24, 0.23],
    ],
    upperColor,
    "top",
  );
  rings(
    [
      [0, 5.02, 0, 0.19, 0.18],
      [0, 5.47, 0, 0.2, 0.19],
    ],
    skin,
    "neck",
  );
  ellipsoid(0, 5.82, 0, 0.38, 0.51, 0.34, skin, "head");
  ellipsoid(0, 5.78, 0.34, 0.07, 0.1, 0.08, skin, "nose");
  const longSleeve = upper && upper.type !== "tshirt";
  for (const sign of [-1, 1]) {
    const shoulder = sign * (body.shoulder + 0.03);
    const elbow = sign * (body.shoulder + 0.23);
    const wrist = sign * (body.shoulder + 0.33);
    rings(
      [
        [wrist, 2.95, 0.02, 0.13, 0.14],
        [longSleeve ? wrist : elbow, longSleeve ? 3.13 : 4.1, 0, 0.17, 0.18],
      ],
      skin,
      "arm",
    );
    rings(
      [
        [
          longSleeve ? wrist : elbow,
          longSleeve ? 3.13 : 4.1,
          0,
          longSleeve ? 0.18 : 0.25,
          0.24,
        ],
        [shoulder, 4.83, 0, 0.28 + extra, 0.29 + extra],
      ],
      upperColor,
      "sleeve",
    );
    ellipsoid(wrist, 2.81, 0.04, 0.145, 0.23, 0.15, skin, "hand");
    const legX = sign * body.hip * 0.52;
    // Only draw exposed skin. Hidden body surfaces otherwise intersect long
    // garment polygons in the lightweight depth-sorted renderer.
    if (bottom?.type !== "trousers") {
      const exposedTop = bottom?.type === "skirt" ? 1.55 : 1.96;
      rings(
        [
          [legX, shoes?.type === "boots" ? 0.92 : 0.35, 0, 0.16, 0.18],
          [legX, exposedTop, 0, 0.24, 0.25],
        ],
        skin,
        "leg",
      );
    }
    if (bottom?.type !== "skirt") {
      const short = bottom?.type === "shorts" || !bottom;
      rings(
        [
          [
            legX,
            short ? 1.96 : 0.42,
            0,
            short ? 0.3 : 0.23,
            short ? 0.32 : 0.24,
          ],
          [legX, 3.2, 0, body.hip * 0.55, 0.37],
        ],
        lowerColor,
        "bottom",
      );
    }
    ellipsoid(
      legX,
      0.23,
      0.16,
      0.25,
      0.22,
      0.46,
      shoes ? fabric(shoes) : "#DEE0ED",
      "shoe",
    );
    if (shoes?.type === "boots")
      rings(
        [
          [legX, 0.25, 0, 0.23, 0.25],
          [legX, 0.92, 0, 0.24, 0.25],
        ],
        fabric(shoes),
        "boot",
      );
  }
  if (bottom?.type === "skirt")
    rings(
      [
        [0, 1.55, 0, body.hip + 0.3, 0.53],
        [0, 3.22, 0, body.hip + 0.04, 0.39],
      ],
      lowerColor,
      "skirt",
    );
  if (["shirt", "jacket", "coat"].includes(upper?.type)) {
    for (let y = hem + 0.15; y < 4.85; y += 0.29) {
      const levels = [
        [hem, 0.36],
        [3.65, 0.33],
        [4.72, 0.4],
        [5, 0.31],
      ];
      const index = levels.findIndex((level) => level[0] >= y);
      const [y0, z0] = levels[index - 1];
      const [y1, z1] = levels[index];
      const z = z0 + ((y - y0) / (y1 - y0)) * (z1 - z0) + extra;
      ellipsoid(0, y, z + 0.014, 0.025, 0.025, 0.015, "#252943", "button", 3);
    }
  }
  for (const item of items.filter(
    (piece) => piece.category === "Accessories",
  )) {
    const color = fabric(item);
    if (item.type === "hat") {
      ellipsoid(0, 6.17, 0, 0.41, 0.2, 0.36, color, "hat");
      ellipsoid(0, 6.08, 0.14, 0.54, 0.04, 0.51, color, "hat-brim");
    } else if (item.type === "scarf") {
      rings(
        [
          [0, 5.03, 0, 0.29, 0.3],
          [0, 5.3, 0, 0.27, 0.27],
        ],
        color,
        "scarf",
      );
      rings(
        [
          [0.2, 4.12, 0.47, 0.12, 0.05],
          [0.18, 5.13, 0.33, 0.13, 0.06],
        ],
        color,
        "scarf-tail",
      );
    } else if (item.type === "belt") {
      rings(
        [
          [0, 3.18, 0, body.hip + 0.035, 0.4],
          [0, 3.3, 0, body.hip + 0.025, 0.4],
        ],
        color,
        "belt",
      );
    } else if (item.type === "bag") {
      ellipsoid(body.hip + 0.27, 2.95, 0.22, 0.32, 0.4, 0.18, color, "bag");
      rings(
        [
          [body.hip + 0.27, 3.25, 0.28, 0.035, 0.035],
          [-body.shoulder * 0.6, 4.96, 0.33, 0.035, 0.035],
        ],
        color,
        "bag-strap",
      );
    }
  }
  return faces;
}

export function projectAvatar(faces, angle = 0, zoom = 1) {
  const yaw = ((((angle % 360) + 360) % 360) * Math.PI) / 180;
  const turn = ([x, y, z]) => {
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
    const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const cy = y - 3.25;
    return [
      rx,
      cy * Math.cos(0.08) - rz * Math.sin(0.08),
      cy * Math.sin(0.08) + rz * Math.cos(0.08),
    ];
  };
  return faces
    .map((face, id) => {
      const points = face.vertices.map(turn);
      const a = points[0],
        b = points[1],
        c = points[2];
      const u = b.map((n, i) => n - a[i]),
        v = c.map((n, i) => n - a[i]);
      const normal = [
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0],
      ];
      const length = Math.hypot(...normal) || 1;
      const light = Math.max(
        0,
        (-normal[0] * 0.4 + normal[1] * 0.6 + normal[2] * 0.7) / length,
      );
      const brightness = 0.68 + 0.32 * light;
      const fill =
        "#" +
        [1, 3, 5]
          .map((index) =>
            Math.round(
              parseInt(face.color.slice(index, index + 2), 16) * brightness,
            )
              .toString(16)
              .padStart(2, "0"),
          )
          .join("");
      return {
        id,
        fill,
        part: face.part,
        depth: points.reduce((sum, point) => sum + point[2], 0) / points.length,
        points: points
          .map(([x, y, z]) => {
            const scale = (52 * zoom * 12) / (12 - z);
            return `${(180 + x * scale).toFixed(2)},${(202 - y * scale).toFixed(2)}`;
          })
          .join(" "),
      };
    })
    .sort((a, b) => a.depth - b.depth);
}

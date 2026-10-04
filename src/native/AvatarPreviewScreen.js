import React, { useMemo, useRef, useState } from "react";
import { View, PanResponder } from "react-native";
import Svg, {
  Polygon,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from "react-native-svg";
import { Text, Pressable, useT } from "./i18n";
import { Screen, Heading, Button, Chip, Choices } from "../stylematch/UI";
import { useTheme, BRAND } from "./theme";
import { useStyleStore } from "./store";
import { SKIN_SHADES } from "../stylematch/skinPalette";
import {
  BODY_SHAPES,
  buildAvatar,
  projectAvatar,
} from "../stylematch/avatar3d";
import { getColorHex, normalizeHex } from "../stylematch/colorMatching";
import Icon from "../stylematch/Icon";

export default function AvatarPreviewScreen({ navigation, route }) {
  const { s, colors } = useTheme();
  const t = useT();
  const profile = useStyleStore((state) => state.profile);
  const items = route.params?.items || [];
  const [shape, setShape] = useState("Straight");
  const [skin, setSkin] = useState(
    normalizeHex(profile.skinHex) ||
      SKIN_SHADES.find((shade) => shade.tone === profile.tone)?.hex ||
      SKIN_SHADES[4].hex,
  );
  const [angle, setAngle] = useState(0);
  const [zoom, setZoom] = useState(1);
  const rotation = useRef(0);
  const startAngle = useRef(0);
  const setRotation = (value) => {
    rotation.current = value;
    setAngle(value);
  };
  const gesture = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, movement) =>
          Math.abs(movement.dx) > 6 &&
          Math.abs(movement.dx) > Math.abs(movement.dy),
        onPanResponderGrant: () => {
          startAngle.current = rotation.current;
        },
        onPanResponderMove: (_, movement) =>
          setRotation(startAngle.current + movement.dx * 0.65),
        onPanResponderTerminationRequest: () => true,
      }),
    [],
  );
  const mesh = useMemo(
    () => buildAvatar(items, { shape, skin }),
    [items, shape, skin],
  );
  const polygons = useMemo(
    () => projectAvatar(mesh, angle, zoom),
    [mesh, angle, zoom],
  );
  if (!items.length)
    return (
      <Screen>
        <Heading
          title="Choose a fit first."
          subtitle="Create or open a saved outfit, then select View in 3D."
        />
        <Button
          title="Build my fit"
          onPress={() => navigation.navigate("Style")}
        />
      </Screen>
    );
  return (
    <Screen>
      <View
        style={{ borderRadius: 24, overflow: "hidden", padding: 22, gap: 9 }}
      >
        <Svg
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          width="100%"
          height="100%"
          pointerEvents="none"
        >
          <Defs>
            <LinearGradient id="preview-banner" x1="0" y1="1" x2="1" y2="0">
              <Stop stopColor={BRAND.blue} />
              <Stop offset="1" stopColor={BRAND.sky} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#preview-banner)" />
        </Svg>
        <Text style={[s.eyebrow, { color: BRAND.lime }]}>
          THE FIT, IN EVERY DIMENSION
        </Text>
        <Text
          accessibilityRole="header"
          style={[s.title, { color: "#FFFFFF" }]}
        >
          Your 360° fit studio.
        </Text>
      </View>
      <Text style={s.body}>
        Customize the avatar and turn your outfit around. This is a simplified
        style preview, not an exact likeness or size prediction. Prints, fabric
        drape and small details are not reproduced.
      </Text>
      <View
        style={[
          s.card,
          { padding: 0, overflow: "hidden", backgroundColor: colors.board },
        ]}
      >
        <View
          {...gesture.panHandlers}
          testID="avatar-stage"
          style={{ width: "100%", height: 390, touchAction: "pan-y" }}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 360 410"
            accessibilityRole="image"
            accessibilityLabel={t("Rotatable 3D outfit avatar")}
          >
            <Ellipse cx="180" cy="383" rx="99" ry="16" fill={colors.line} />
            <Ellipse cx="180" cy="376" rx="75" ry="12" fill={colors.card} />
            {polygons.map((polygon) => (
              <Polygon
                key={polygon.id}
                points={polygon.points}
                fill={polygon.fill}
                stroke={polygon.fill}
                strokeWidth={0.35}
              />
            ))}
          </Svg>
        </View>
        <View style={{ padding: 16, gap: 14 }}>
          <Text style={[s.small, s.centered]}>
            Swipe sideways to rotate · scroll vertically to move down
          </Text>
          <View style={[s.row, { justifyContent: "center" }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Rotate left"
              style={s.iconButton}
              onPress={() => setRotation(rotation.current - 30)}
            >
              <Icon name="rotate-ccw" />
            </Pressable>
            <Text testID="avatar-angle" style={s.label}>
              {Math.round(((angle % 360) + 360) % 360)}°
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Rotate right"
              style={s.iconButton}
              onPress={() => setRotation(rotation.current + 30)}
            >
              <Icon name="rotate-cw" />
            </Pressable>
          </View>
          <View style={[s.wrap, { justifyContent: "center" }]}>
            {[
              ["Front", 0],
              ["Side", 90],
              ["Rear view", 180],
            ].map(([label, degrees]) => (
              <Chip
                key={label}
                selected={((angle % 360) + 360) % 360 === degrees}
                onPress={() => setRotation(degrees)}
              >
                {label}
              </Chip>
            ))}
          </View>
          <View style={[s.row, { justifyContent: "center" }]}>
            <Button
              title="Zoom out"
              secondary
              disabled={zoom <= 0.8}
              onPress={() =>
                setZoom((value) => Math.max(0.8, +(value - 0.1).toFixed(1)))
              }
            />
            <Button
              title="Zoom in"
              secondary
              disabled={zoom >= 1.2}
              onPress={() =>
                setZoom((value) => Math.min(1.2, +(value + 0.1).toFixed(1)))
              }
            />
          </View>
        </View>
      </View>
      <Choices
        label="Avatar shape"
        values={Object.keys(BODY_SHAPES)}
        value={shape}
        onChange={setShape}
      />
      <View style={{ gap: 12 }}>
        <Text style={s.label}>Avatar skin shade</Text>
        <View style={s.wrap}>
          {SKIN_SHADES.map((shade) => (
            <Pressable
              key={shade.id}
              accessibilityRole="button"
              accessibilityLabel={`Skin shade ${shade.id}`}
              accessibilityState={{ selected: skin === shade.hex }}
              onPress={() => setSkin(shade.hex)}
              style={{
                width: 46,
                height: 46,
                padding: 4,
                borderRadius: 23,
                borderWidth: 2,
                borderColor: skin === shade.hex ? colors.pop : "transparent",
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: 20,
                  backgroundColor: shade.hex,
                }}
              />
            </Pressable>
          ))}
        </View>
      </View>
      <View style={s.card}>
        <Text style={s.h3}>In this fit</Text>
        {items.map((item, index) => (
          <View key={`${item.id}-${index}`} style={s.row}>
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: getColorHex(item) || colors.line,
              }}
            />
            <Text translate={false} style={[s.body, { flex: 1 }]}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>
      <Button
        title="Check this outfit on me"
        icon="camera"
        secondary
        onPress={() => navigation.navigate("OutfitCheck", { items })}
      />
    </Screen>
  );
}

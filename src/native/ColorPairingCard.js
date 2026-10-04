import React from "react";
import { View, Linking } from "react-native";
import { Text } from "./i18n";
import {
  outfitColorPairing,
  pinterestInspirationUrl,
} from "../stylematch/colorMatching";
import { Button } from "../stylematch/UI";
import { useStyleStore } from "./store";
import { useTheme } from "./theme";

export default function ColorPairingCard({ look }) {
  const { s, colors, dark } = useTheme();

  const notify = useStyleStore((state) => state.notify);
  const pairing = outfitColorPairing(look.items, look.colorApproach);
  if (!pairing) return null;
  const openInspiration = async () => {
    try {
      await Linking.openURL(pinterestInspirationUrl(look.items, look.occasion));
    } catch {
      notify("Couldn’t open Pinterest. Please try again.");
    }
  };
  return (
    <View style={s.card}>
      <Text style={s.eyebrow}>TOP + BOTTOM / COLOR PAIRING</Text>
      <Text style={s.h3}>{pairing.label}</Text>
      <View style={[s.row, { alignItems: "flex-start", gap: 16 }]}>
        {[
          [pairing.top, pairing.topHex, "Top"],
          [pairing.bottom, pairing.bottomHex, "Bottom"],
        ].map(([item, hex, label]) => (
          <View key={label} style={{ flex: 1, gap: 6 }}>
            <View
              style={{
                height: 48,
                borderRadius: 12,
                backgroundColor: hex || colors.bg,
                borderWidth: 1,
                borderColor: colors.line,
              }}
            />
            <Text style={s.label}>
              {label} · {hex || "Unknown color"}
            </Text>
            <Text style={s.small} translate={false}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>
      <Text style={s.body}>{pairing.explanation}</Text>
      {pairing.available && (
        <Text style={s.small}>
          {pairing.approach} · {pairing.score}/100 style estimate. Color harmony
          helps order your suggestions.
        </Text>
      )}
      <Button
        title="Find inspiration on Pinterest"
        secondary
        icon="external-link"
        onPress={openInspiration}
      />
      <Text style={s.small}>
        Opens Pinterest with the color families and outfit style. Matching runs
        locally; Pinterest inspiration may differ from your exact shades.
      </Text>
    </View>
  );
}

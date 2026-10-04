import React, { useEffect, useRef } from "react";
import { Animated, View, AccessibilityInfo, Platform } from "react-native";
import { Text } from "./i18n";
import { useTheme } from "./theme";
export default function LaunchAnimation({ onFinish }) {
  const { s, colors } = useTheme();
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(onFinish, 2100);
    AccessibilityInfo.isReduceMotionEnabled()
      .then((reduced) => {
        if (cancelled) return;
        if (reduced) progress.setValue(1);
        else
          Animated.timing(progress, {
            toValue: 1,
            duration: 1700,
            useNativeDriver: Platform.OS !== "web",
          }).start();
      })
      .catch(() => progress.setValue(1));
    return () => {
      cancelled = true;
      clearTimeout(timer);
      progress.stopAnimation();
    };
  }, [onFinish, progress]);
  return (
    <View
      testID="launch-animation"
      style={[
        s.screen,
        { alignItems: "center", justifyContent: "center", gap: 28 },
      ]}
    >
      <Animated.View
        style={{
          opacity: progress.interpolate({
            inputRange: [0, 0.3, 1],
            outputRange: [0, 1, 1],
          }),
          transform: [
            {
              scale: progress.interpolate({
                inputRange: [0, 0.7, 1],
                outputRange: [0.75, 1.04, 1],
              }),
            },
          ],
        }}
      >
        <View
          style={{
            width: 124,
            height: 124,
            borderRadius: 62,
            borderWidth: 1,
            borderColor: colors.green,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.soft,
          }}
        >
          <Text style={[s.logo, { fontSize: 55, color: colors.green }]}>
            S.
          </Text>
        </View>
      </Animated.View>
      <Text style={[s.logo, { fontSize: 32 }]}>StyleMatch.</Text>
      <View style={{ flexDirection: "row", gap: 9 }}>
        {[colors.pop, colors.sky, colors.lime].map((color, index) => (
          <Animated.View
            key={color}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: color,
              opacity: progress.interpolate({
                inputRange: [0, 0.2 + index * 0.15, 1],
                outputRange: [0, 0.2, 1],
              }),
            }}
          />
        ))}
      </View>
    </View>
  );
}

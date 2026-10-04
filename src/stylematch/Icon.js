import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { useTheme } from "../native/theme";
const names = {
  wardrobe: "shopping-bag",
  sparkle: "star",
  bag: "shopping-bag",
  arrow: "arrow-right",
  chevron: "chevron-right",
  down: "chevron-down",
  refresh: "refresh-cw",
  close: "x",
  location: "map-pin",
  leaf: "feather",
  edit: "edit-2",
  share: "share-2",
  trash: "trash-2",
};
export default function Icon({ name, size = 20, color }) {
  const { colors } = useTheme();
  return (
    <Feather
      name={names[name] || name}
      size={size}
      color={color || colors.green}
      accessible={false}
    />
  );
}

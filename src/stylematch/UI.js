import React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Text, Pressable, TextInput } from "../native/i18n";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "./Icon";
import Garment from "./Garment";
import { useTheme } from "../native/theme";
export function Screen({ children, style, testID }) {
  const { s, colors, dark } = useTheme();

  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        testID={testID}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          s.content,
          { paddingBottom: Math.max(32, insets.bottom + 16) },
          style,
        ]}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
export function Button({
  children,
  title,
  onPress,
  icon,
  secondary = false,
  disabled = false,
  style,
  accessibilityLabel,
  danger,
}) {
  const { s, colors, dark } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondaryButton,
        danger && { backgroundColor: colors.error, borderColor: colors.error },
        disabled && s.disabled,
        pressed && s.pressed,
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          color={secondary ? colors.green : colors.onAccent}
        />
      )}
      <Text style={[s.buttonText, secondary && s.secondaryText]}>
        {title || children}
      </Text>
    </Pressable>
  );
}
export function Chip({ children, selected, onPress }) {
  const { s, colors, dark } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [
        s.chip,
        selected && s.selectedChip,
        pressed && s.pressed,
      ]}
    >
      <Text style={[s.chipText, selected && s.selectedText]}>{children}</Text>
    </Pressable>
  );
}
export function Choices({ label, values, value, onChange, multiple = false }) {
  const { s, colors, dark } = useTheme();

  return (
    <View style={{ gap: 10 }}>
      <Text style={s.label}>{label}</Text>
      <View style={s.wrap}>
        {values.map((v) => (
          <Chip
            key={v}
            selected={multiple ? value.includes(v) : value === v}
            onPress={() => onChange(v)}
          >
            {v}
          </Chip>
        ))}
      </View>
    </View>
  );
}
export function Input({ label, ...props }) {
  const { s, colors, dark } = useTheme();

  return (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={s.input}
        {...props}
      />
    </View>
  );
}
export function Heading({ eyebrow, title, subtitle, action }) {
  const { s, colors, dark } = useTheme();

  return (
    <View style={{ gap: 9 }}>
      <Text style={s.eyebrow}>{eyebrow}</Text>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {subtitle && <Text style={s.body}>{subtitle}</Text>}
      {action}
    </View>
  );
}
export function SectionTitle({ title, action, onPress }) {
  const { s, colors, dark } = useTheme();

  return (
    <View style={s.between}>
      <Text accessibilityRole="header" style={s.sectionTitle}>
        {title}
      </Text>
      {action && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action}
          onPress={onPress}
          style={s.link}
        >
          <Text style={s.linkText}>{action}</Text>
          <Icon name="arrow" size={15} />
        </Pressable>
      )}
    </View>
  );
}
export function Score({ value }) {
  const { s, colors, dark } = useTheme();

  return (
    <View style={s.score}>
      <Icon name="sparkle" size={13} />
      <Text style={s.scoreText}>{value}% match</Text>
    </View>
  );
}
export function GarmentCard({ item, onPress, width, palette = [] }) {
  const { s, colors, dark } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${item.name}`}
      onPress={() => onPress(item)}
      style={({ pressed }) => [s.itemCard, { width }, pressed && s.pressed]}
    >
      <View style={s.itemArt}>
        <Garment item={item} />
        {palette.includes(item.color) && (
          <View style={{ position: "absolute", right: 12, top: 12 }}>
            <Icon name="sparkle" size={15} />
          </View>
        )}
      </View>
      <View style={s.itemInfo}>
        <Text style={s.brand}>{item.brand || "MY WARDROBE"}</Text>
        <Text style={s.itemName} translate={false}>
          {item.name}
        </Text>
        <Text style={s.small}>
          {item.color} ·{" "}
          {item.status === "incoming" ? "Incoming" : item.category}
        </Text>
      </View>
    </Pressable>
  );
}
export function OutfitBoard({ items, onItem, style }) {
  const { s, colors, dark } = useTheme();

  return (
    <View style={[s.board, style]}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityRole={onItem ? "button" : undefined}
          accessibilityLabel={item.name}
          disabled={!onItem}
          onPress={() => onItem?.(item)}
          style={s.piece}
        >
          <View style={{ width: "100%", flex: 1 }}>
            <Garment item={item} />
          </View>
          <Text style={s.pieceLabel} numberOfLines={1} translate={false}>
            {item.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function EmptyState({ title, description, action, icon = "wardrobe" }) {
  const { s, colors, dark } = useTheme();

  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <Icon name={icon} size={30} />
      </View>
      <Text accessibilityRole="header" style={[s.h2, s.centered]}>
        {title}
      </Text>
      <Text style={[s.body, s.centered]}>{description}</Text>
      {action}
    </View>
  );
}
export function Confirm({
  visible,
  title,
  description,
  onConfirm,
  onClose,
  action = "Remove",
}) {
  const { s, colors, dark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.modalBackdrop}>
        <View accessibilityViewIsModal style={s.modalCard}>
          <Text accessibilityRole="header" style={s.h2}>
            {title}
          </Text>
          <Text style={s.body}>{description}</Text>
          <Button title={action} danger onPress={onConfirm} />
          <Button title="Cancel" secondary onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

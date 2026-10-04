import React from "react";
import {
  Text as NativeText,
  TextInput as NativeInput,
  Pressable as NativePressable,
  Switch as NativeSwitch,
} from "react-native";
import { useSettings } from "./settings";
import ja from "./ja";
export function translate(value, language = "en") {
  if (language !== "ja" || typeof value !== "string") return value;
  const key = value.replace(/\s+/g, " ").trim();
  if (Object.prototype.hasOwnProperty.call(ja, key)) return ja[key];
  const list = (text) =>
    text
      .split(/, | and /)
      .map((part) => {
        const canonical = [
          "Tops",
          "Bottoms",
          "Shoes",
          "Jackets",
          "Casual",
          "Office",
          "Date",
          "Wedding",
          "Party",
          "Travel",
        ].find((value) => value.toLowerCase() === part.toLowerCase());
        return translate(canonical || part, language);
      })
      .join("、");
  let match;
  if (
    (match = key.match(
      /^Add (.+) that suit (.+) and the weather to complete this look\.$/,
    ))
  )
    return `${list(match[2])}と天気に合う${list(match[1])}を追加してコーデを完成させましょう。`;
  if ((match = key.match(/^Your look needs (.+)\.$/)))
    return `このコーデには${list(match[1].replace(/ & /g, ", "))}が必要です。`;
  if ((match = key.match(/^Shop suggestions · (.+)$/)))
    return `購入候補 · ${list(match[1])}`;
  if ((match = key.match(/^Complete your look: (.+)$/)))
    return `コーデを完成：${list(match[1])}`;
  if ((match = key.match(/^Glow color (.+)$/)))
    return `おすすめの色：${translate(match[1], language)}`;
  if ((match = key.match(/^Updated (.+) · Open-Meteo$/)))
    return `更新：${match[1]} · Open-Meteo`;
  if (
    (match = key.match(
      /^(A light layer adds texture|A simple silhouette keeps things effortless) at (.+)°C, with (.+) to finish\.$/,
    ))
  )
    return `${match[2]}°Cの装いに${match[3]}を合わせます。${match[1].startsWith("A light") ? "薄手の重ね着で素材感をプラス。" : "シンプルなシルエットで自然にまとめます。"}`;
  if (key.includes(". "))
    return key
      .split(/(?<=\.) /)
      .map((part) => translate(part, language))
      .join(" ");
  const patterns = [
    [/^Good morning, (.+)$/, "こんにちは、$1"],
    [/^A peek into your wardrobe · (\d+)$/, "ワードローブ · $1"],
    [/^Shop suggestions · (.+)$/, "購入候補 · $1"],
    [/^Complete your look: (.+)$/, "コーデを完成：$1"],
    [/^Browse (.+)$/, "$1を見る"],
    [/^Glow color (.+)$/, "おすすめの色：$1"],
    [/^View (.+)$/, "$1を表示"],
    [/^Visit (.+)$/, "$1のサイトへ"],
    [/^No owned (.+) yet\.$/, "このカテゴリーの服はまだありません。"],
    [/^(\d+)% match$/, "マッチ度 $1%"],
  ];
  for (const [pattern, replacement] of patterns)
    if (pattern.test(key)) return key.replace(pattern, replacement);
  if (key.includes(" · "))
    return key
      .split(" · ")
      .map((part) => translate(part, language))
      .join(" · ");
  if (key.includes(", "))
    return key
      .split(", ")
      .map((part) => translate(part, language))
      .join("、");
  return value;
}
export function useT() {
  const language = useSettings((state) => state.language);
  return (value) => translate(value, language);
}
export function Text({ children, translate: localize = true, ...props }) {
  const t = useT();
  const language = useSettings((state) => state.language);
  const local = (child) =>
    typeof child === "string"
      ? t(child)
      : Array.isArray(child)
        ? child.map(local)
        : child;
  return (
    <NativeText
      {...props}
      style={[
        language === "ja" && { fontFamily: "StyleMatchJapanese" },
        props.style,
      ]}
    >
      {localize ? local(children) : children}
    </NativeText>
  );
}
export const TextInput = React.forwardRef(function TextInput(props, ref) {
  const t = useT();
  const language = useSettings((state) => state.language);
  return (
    <NativeInput
      {...props}
      ref={ref}
      style={[
        language === "ja" && { fontFamily: "StyleMatchJapanese" },
        props.style,
      ]}
      placeholder={t(props.placeholder)}
      accessibilityLabel={t(props.accessibilityLabel)}
    />
  );
});
export const Pressable = React.forwardRef(function Pressable(props, ref) {
  const t = useT();
  return (
    <NativePressable
      {...props}
      ref={ref}
      accessibilityLabel={t(props.accessibilityLabel)}
    />
  );
});
export function Switch(props) {
  const t = useT();
  return (
    <NativeSwitch {...props} accessibilityLabel={t(props.accessibilityLabel)} />
  );
}

import React from "react";
import { Screen, Heading, Choices } from "../stylematch/UI";
import { useSettings } from "./settings";
export default function SettingsScreen() {
  const { appearance, language, setAppearance, setLanguage } = useSettings();
  return (
    <Screen>
      <Heading
        eyebrow="Settings"
        title="Make it yours."
        subtitle="Your display and language preferences are saved on this device."
      />
      <Choices
        label="Appearance"
        values={["System", "Light", "Dark"]}
        value={{ system: "System", light: "Light", dark: "Dark" }[appearance]}
        onChange={(value) => setAppearance(value.toLowerCase())}
      />
      <Choices
        label="Language"
        values={["English", "Japanese"]}
        value={language === "ja" ? "Japanese" : "English"}
        onChange={(value) => setLanguage(value === "Japanese" ? "ja" : "en")}
      />
    </Screen>
  );
}

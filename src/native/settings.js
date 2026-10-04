import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
export const useSettings = create(
  persist(
    (set) => ({
      appearance: "system",
      language: "en",
      ready: false,
      setAppearance: (appearance) => {
        if (["system", "light", "dark"].includes(appearance))
          set({ appearance });
      },
      setLanguage: (language) => {
        if (["en", "ja"].includes(language)) set({ language });
      },
    }),
    {
      name: "stylematch:settings:v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ appearance, language }) => ({ appearance, language }),
      merge: (saved, current) => ({
        ...current,
        appearance: ["system", "light", "dark"].includes(saved?.appearance)
          ? saved.appearance
          : "system",
        language: ["en", "ja"].includes(saved?.language)
          ? saved.language
          : "en",
      }),
      onRehydrateStorage: () => () => useSettings.setState({ ready: true }),
    },
  ),
);

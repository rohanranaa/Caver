import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DEMO_WEATHER,
  INITIAL_ITEMS,
  INITIAL_PROFILE,
} from "../stylematch/data";

export const initialData = () => ({
  items: INITIAL_ITEMS,
  profile: INITIAL_PROFILE,
  looks: [],
  history: [],
  weather: DEMO_WEATHER,
});
let persistenceError = "";
const storage = {
  async getItem(key) {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        return validData(parsed.state) ? stored : null;
      }
      // Keep wardrobes created by the earlier browser preview when moving to Expo web.
      const previous = JSON.parse(await AsyncStorage.getItem("stylematch:v1"));
      return validData(previous)
        ? JSON.stringify({
            state: { ...initialData(), ...previous },
            version: 0,
          })
        : null;
    } catch {
      persistenceError =
        "Saved data could not be loaded. You can still explore the sample wardrobe.";
      return null;
    }
  },
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      persistenceError = "";
    } catch {
      persistenceError =
        "Device storage is full or unavailable. Export your wardrobe to keep a copy.";
      if (useStyleStore.getState().notice !== persistenceError)
        useStyleStore.setState({ notice: persistenceError });
    }
  },
  async removeItem(key) {
    await AsyncStorage.removeItem(key);
  },
};
export function validData(value) {
  const validItem = (i) =>
    i &&
    typeof i.id === "string" &&
    typeof i.name === "string" &&
    typeof i.category === "string" &&
    typeof i.color === "string";
  return (
    !!value &&
    Array.isArray(value.items) &&
    value.items.every(validItem) &&
    Array.isArray(value.looks) &&
    Array.isArray(value.history) &&
    [...value.looks, ...value.history].every(
      (l) =>
        l &&
        Array.isArray(l.items) &&
        l.items.every(validItem) &&
        l.scores &&
        typeof l.scores.total === "number",
    ) &&
    typeof value.profile?.name === "string" &&
    ["styles", "glowColors", "avoidColors"].every(
      (k) =>
        Array.isArray(value.profile[k]) &&
        value.profile[k].every((c) => typeof c === "string"),
    )
  );
}
export const getPersistenceError = () => persistenceError;
export const useStyleStore = create(
  persist(
    (set, get) => ({
      ...initialData(),
      accountId: "guest",
      switchAccount: async (user) => {
        const current = get();
        const nextId = user?.id || "guest";
        if (current.accountId === nextId) return;
        const snapshot = ({ items, profile, looks, history, weather }) => ({
          items,
          profile,
          looks,
          history,
          weather,
        });
        await AsyncStorage.setItem(
          `stylematch:account:${current.accountId || "guest"}`,
          JSON.stringify(snapshot(current)),
        );
        const raw = await AsyncStorage.getItem(`stylematch:account:${nextId}`);
        const saved = raw ? JSON.parse(raw) : null;
        if (saved && !validData(saved))
          throw new Error("Invalid saved wardrobe");
        set({
          ...(saved || {
            ...initialData(),
            items: [],
            looks: [],
            history: [],
            profile: {
              ...INITIAL_PROFILE,
              name: user?.user_metadata?.name || "Guest",
              styles: [],
              glowColors: [],
              avoidColors: [],
            },
          }),
          accountId: nextId,
          notice: "",
        });
      },
      ready: false,
      notice: "",
      setReady: () => set({ ready: true, notice: persistenceError }),
      notify: (notice) => set({ notice }),
      dismiss: () => set({ notice: "" }),
      saveItem: (item) =>
        set((s) => ({
          items: s.items.some((i) => i.id === item.id)
            ? s.items.map((i) => (i.id === item.id ? item : i))
            : [item, ...s.items],
          notice: "Your wardrobe has a fresh update.",
        })),
      removeItem: (id) =>
        set((s) => ({
          items: s.items.filter((i) => i.id !== id),
          notice: "Piece removed from your wardrobe.",
        })),
      saveProfile: (profile) =>
        set({ profile, notice: "Your style profile, a little more you." }),
      setWeather: (weather) =>
        set({ weather, notice: "Forecast updated for your recommendations." }),
      saveLook: (look) =>
        set((s) => {
          const exists = s.looks.some((l) => l.id === look.id);
          return {
            looks: exists
              ? s.looks.filter((l) => l.id !== look.id)
              : [{ ...look, savedOn: new Date().toISOString() }, ...s.looks],
            notice: exists
              ? "Look removed from your collection."
              : "A good look, saved for later.",
          };
        }),
      wearLook: (look) => {
        if (
          !look.items.length ||
          !look.items.every((piece) =>
            get().items.some((i) => i.id === piece.id && i.status === "owned"),
          )
        ) {
          set({
            notice:
              "A piece in this look is no longer owned. Create a fresh look.",
          });
          return false;
        }
        const wornOn = new Date().toISOString();
        set((s) => ({
          history: [{ ...look, wornOn }, ...s.history],
          items: s.items.map((i) =>
            look.items.some((p) => p.id === i.id)
              ? { ...i, lastWornAt: wornOn }
              : i,
          ),
          notice: "Looking good! Outfit added to your history.",
        }));
        return true;
      },
      deleteData: async () => {
        await AsyncStorage.removeItem("stylematch:v1").catch(() => {});
        set({
          items: [],
          looks: [],
          history: [],
          profile: {
            ...INITIAL_PROFILE,
            name: "Guest",
            styles: [],
            glowColors: [],
            avoidColors: [],
          },
          weather: DEMO_WEATHER,
          notice: "Your local data has been deleted.",
        });
      },
    }),
    {
      name: "stylematch:expo:v1",
      storage: createJSONStorage(() => storage),
      partialize: ({ items, profile, looks, history, weather, accountId }) => ({
        items,
        profile,
        looks,
        history,
        weather,
        accountId,
      }),
      onRehydrateStorage: () => (state) => state?.setReady(),
    },
  ),
);

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStyleStore, initialData, validData } from "./store";
import { recommend } from "../stylematch/service";
beforeEach(async () => {
  await AsyncStorage.clear();
  useStyleStore.setState({ ...initialData(), ready: true, notice: "" });
});
test("save and wear record snapshots and update only owned clothing", () => {
  const data = useStyleStore.getState();
  const look = recommend(data);
  data.saveLook(look);
  expect(useStyleStore.getState().looks).toHaveLength(1);
  expect(data.wearLook(look)).toBe(true);
  expect(useStyleStore.getState().history).toHaveLength(1);
  expect(
    useStyleStore.getState().items.find((i) => i.id === look.items[0].id)
      .lastWornAt,
  ).toBeTruthy();
});
test("removed or incoming pieces cannot be worn from a saved snapshot", () => {
  const data = useStyleStore.getState();
  const look = recommend(data);
  data.removeItem(look.items[0].id);
  expect(data.wearLook(look)).toBe(false);
  expect(useStyleStore.getState().history).toHaveLength(0);
});
test("AsyncStorage rehydrates persisted wardrobe data", async () => {
  const data = { ...initialData(), items: [] };
  await AsyncStorage.setItem(
    "stylematch:expo:v1",
    JSON.stringify({ state: data, version: 0 }),
  );
  await useStyleStore.persist.rehydrate();
  expect(useStyleStore.getState().items).toEqual([]);
  expect(useStyleStore.getState().ready).toBe(true);
});
test("older web wardrobes migrate into the Expo storage adapter", async () => {
  await AsyncStorage.removeItem("stylematch:expo:v1");
  await AsyncStorage.setItem(
    "stylematch:v1",
    JSON.stringify({
      ...initialData(),
      profile: { ...initialData().profile, name: "Taylor" },
    }),
  );
  await useStyleStore.persist.rehydrate();
  expect(useStyleStore.getState().profile.name).toBe("Taylor");
});
test("malformed stored items are rejected before they can crash rendering", () => {
  expect(validData({ ...initialData(), items: [null] })).toBe(false);
  expect(validData(initialData())).toBe(true);
});
test("delete data persists an empty guest wardrobe and clears legacy storage", async () => {
  await useStyleStore.getState().deleteData();
  expect(useStyleStore.getState().items).toEqual([]);
  expect(useStyleStore.getState().profile.name).toBe("Guest");
  expect(AsyncStorage.removeItem).toHaveBeenCalledWith("stylematch:v1");
});

test("account wardrobes remain separate across sign-in, logout, and another account", async () => {
  useStyleStore.setState({ ...initialData(), accountId: "guest" });
  const guest = useStyleStore.getState().items;
  await useStyleStore
    .getState()
    .switchAccount({ id: "user-a", user_metadata: { name: "A" } });
  expect(useStyleStore.getState().items).toEqual([]);
  useStyleStore.getState().saveItem({ ...guest[0], id: "private-a" });
  await useStyleStore.getState().switchAccount({ id: "user-b" });
  expect(useStyleStore.getState().items).toEqual([]);
  await useStyleStore.getState().switchAccount(null);
  expect(useStyleStore.getState().items).toEqual(guest);
  await useStyleStore.getState().switchAccount({ id: "user-a" });
  expect(useStyleStore.getState().items.map((item) => item.id)).toEqual([
    "private-a",
  ]);
});

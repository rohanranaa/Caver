import * as SecureStore from "expo-secure-store";
// Chunk long refresh-token sessions to stay below native keychain item limits.
export default {
  async getItem(key) {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return null;
    const { version, count } = JSON.parse(raw);
    const parts = await Promise.all(
      Array.from({ length: count }, (_, i) =>
        SecureStore.getItemAsync(`${key}.${version}.${i}`),
      ),
    );
    return parts.every((part) => part !== null) ? parts.join("") : null;
  },
  async setItem(key, value) {
    const old = await SecureStore.getItemAsync(key);
    const version = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const count = Math.ceil(value.length / 1500);
    for (let i = 0; i < count; i++)
      await SecureStore.setItemAsync(
        `${key}.${version}.${i}`,
        value.slice(i * 1500, (i + 1) * 1500),
      );
    await SecureStore.setItemAsync(key, JSON.stringify({ version, count }));
    if (old) {
      const previous = JSON.parse(old);
      await Promise.all(
        Array.from({ length: previous.count }, (_, i) =>
          SecureStore.deleteItemAsync(`${key}.${previous.version}.${i}`),
        ),
      );
    }
  },
  async removeItem(key) {
    const old = await SecureStore.getItemAsync(key);
    await SecureStore.deleteItemAsync(key);
    if (old) {
      const previous = JSON.parse(old);
      await Promise.all(
        Array.from({ length: previous.count }, (_, i) =>
          SecureStore.deleteItemAsync(`${key}.${previous.version}.${i}`),
        ),
      );
    }
  },
};

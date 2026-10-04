import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
export async function exportWardrobe(data) {
  if (!(await Sharing.isAvailableAsync()))
    throw new Error("Sharing is unavailable on this device.");
  const file = new File(Paths.cache, "stylematch-wardrobe.json");
  file.write(JSON.stringify(data, null, 2));
  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    UTI: "public.json",
    dialogTitle: "Export your wardrobe",
  });
}

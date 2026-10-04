import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
export async function pickClothingPhoto(camera = false) {
  if (camera) {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted)
      throw new Error(
        "Camera access is off. Allow it in your device settings or choose Gallery instead.",
      );
  }
  const options = {
    mediaTypes: ["images"],
    allowsEditing: Platform.OS !== "web",
    quality: 0.6,
    base64: true,
    selectionLimit: 1,
  };
  const result = camera
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync(options);
  if (result.canceled) return null;
  const photo = result.assets?.[0];
  if (!photo?.base64)
    throw new Error("Couldn’t read this photo. Please try another image.");
  if (photo.base64.length > 2800000)
    throw new Error(
      "Choose a smaller photo (under 2 MB) to keep your wardrobe fast.",
    );
  return `data:${photo.mimeType || "image/jpeg"};base64,${photo.base64}`;
}

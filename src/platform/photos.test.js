import * as ImagePicker from "expo-image-picker";
import { pickClothingPhoto } from "./photos";
beforeEach(() => jest.clearAllMocks());
test("camera denial offers a gallery fallback and never launches the camera", async () => {
  ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({
    granted: false,
  });
  await expect(pickClothingPhoto(true)).rejects.toThrow("Gallery");
  expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
});
test("canceling the picker does not add an image", async () => {
  ImagePicker.launchImageLibraryAsync.mockResolvedValue({ canceled: true });
  expect(await pickClothingPhoto()).toBeNull();
});
test("picked photos are stored durably as data instead of temporary cache URIs", async () => {
  ImagePicker.launchImageLibraryAsync.mockResolvedValue({
    canceled: false,
    assets: [
      {
        base64: "YWJj",
        mimeType: "image/jpeg",
        uri: "file:///temporary/image.jpg",
      },
    ],
  });
  expect(await pickClothingPhoto()).toBe("data:image/jpeg;base64,YWJj");
});

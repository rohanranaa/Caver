import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStyleStore, initialData } from "./native/store";
import { WardrobeScreen } from "./native/MainScreens";
import { ClothingScreen, PreferencesScreen } from "./native/EditScreens";
import { StyleScreen } from "./native/StylingScreens";
import * as outfitService from "./stylematch/service";
const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  replace: jest.fn(),
};
beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  useStyleStore.setState({ ...initialData(), ready: true, notice: "" });
});
test("native wardrobe search filters pieces and opens the matching detail screen", async () => {
  await render(<WardrobeScreen navigation={navigation} />);
  await fireEvent.changeText(screen.getByLabelText("Search wardrobe"), "linen");
  expect(screen.getByText("Linen blend shirt")).toBeOnTheScreen();
  expect(screen.queryByText("Relaxed fit chinos")).not.toBeOnTheScreen();
  await fireEvent.press(
    screen.getByRole("button", { name: "View Linen blend shirt" }),
  );
  expect(navigation.navigate).toHaveBeenCalledWith("ClothingDetail", {
    id: "shirt-cream",
  });
});
test("native clothing form validates a name and saves an owned piece", async () => {
  await render(<ClothingScreen navigation={navigation} route={{}} />);
  await fireEvent.press(
    screen.getByRole("button", { name: "Add to my wardrobe" }),
  );
  expect(screen.getByText("Give this piece a name.")).toBeOnTheScreen();
  await fireEvent.changeText(screen.getByLabelText("Name"), "Travel shirt");
  await fireEvent.press(
    screen.getByRole("button", { name: "Add to my wardrobe" }),
  );
  expect(useStyleStore.getState().items[0]).toMatchObject({
    name: "Travel shirt",
    status: "owned",
    category: "Tops",
  });
  expect(navigation.goBack).toHaveBeenCalled();
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "stylematch:expo:v1",
      expect.stringContaining("Travel shirt"),
    ),
  );
});
test("native preferences keep glow and avoid colors mutually exclusive", async () => {
  await render(
    <PreferencesScreen
      navigation={navigation}
      route={{ params: { paletteOnly: true } }}
    />,
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Glow color Grey" }),
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Save my preferences" }),
  );
  expect(useStyleStore.getState().profile.glowColors).toContain("Grey");
  expect(useStyleStore.getState().profile.avoidColors).not.toContain("Grey");
});
test("native outfit builder produces the requested occasion and navigates to its result", async () => {
  const request = jest
    .spyOn(outfitService, "createOutfit")
    .mockImplementation(async (options) => outfitService.recommend(options));
  await render(<StyleScreen navigation={navigation} route={{}} />);
  await fireEvent.press(screen.getByRole("button", { name: "Office" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Create my outfit" }),
  );
  await waitFor(
    () =>
      expect(navigation.replace).toHaveBeenCalledWith(
        "Result",
        expect.objectContaining({
          look: expect.objectContaining({
            occasion: "Office",
            name: "Your next power move",
          }),
        }),
      ),
    { timeout: 3000 },
  );
  request.mockRestore();
});

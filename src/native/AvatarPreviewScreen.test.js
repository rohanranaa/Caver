import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import AvatarPreviewScreen from "./AvatarPreviewScreen";
import { ResultScreen } from "./StylingScreens";
import { recommend } from "../stylematch/service";
import {
  INITIAL_ITEMS,
  INITIAL_PROFILE,
  DEMO_WEATHER,
} from "../stylematch/data";
import { useSettings } from "./settings";
import { useStyleStore, initialData } from "./store";
const navigation = { navigate: jest.fn() };
beforeEach(() => {
  jest.clearAllMocks();
  useSettings.setState({ appearance: "light", language: "en", ready: true });
  useStyleStore.setState({ ...initialData(), ready: true });
});
test("a generated fit opens the 3D preview with exactly its chosen garments", async () => {
  const look = recommend({
    items: INITIAL_ITEMS,
    profile: INITIAL_PROFILE,
    weather: DEMO_WEATHER,
  });
  await render(
    <ResultScreen navigation={navigation} route={{ params: { look } }} />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "View in 3D" }));
  expect(navigation.navigate).toHaveBeenCalledWith("AvatarPreview", {
    items: look.items,
  });
});
test("preview rotates, changes shape and shade, and supports accessible view controls", async () => {
  await render(
    <AvatarPreviewScreen
      navigation={navigation}
      route={{ params: { items: INITIAL_ITEMS.slice(0, 3) } }}
    />,
  );
  await fireEvent.press(screen.getByRole("button", { name: "Rotate right" }));
  expect(screen.getByTestId("avatar-angle")).toHaveTextContent("30°");
  await fireEvent.press(screen.getByRole("button", { name: "Rear view" }));
  expect(screen.getByTestId("avatar-angle")).toHaveTextContent("180°");
  await fireEvent.press(screen.getByRole("button", { name: "Broad" }));
  expect(
    screen.getByRole("button", { name: "Broad", selected: true }),
  ).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole("button", { name: "Skin shade S10" }));
  expect(
    screen.getByRole("button", { name: "Skin shade S10", selected: true }),
  ).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole("button", { name: "Zoom in" }));
  await fireEvent.press(screen.getByRole("button", { name: "Zoom in" }));
  expect(screen.getByRole("button", { name: "Zoom in" })).toBeDisabled();
  await fireEvent.press(
    screen.getByRole("button", { name: "Check this outfit on me" }),
  );
  expect(navigation.navigate).toHaveBeenCalledWith("OutfitCheck", {
    items: INITIAL_ITEMS.slice(0, 3),
  });
});
test("an empty preview guides the user to create a fit", async () => {
  await render(<AvatarPreviewScreen navigation={navigation} route={{}} />);
  expect(screen.queryByTestId("avatar-stage")).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Build my fit" }));
  expect(navigation.navigate).toHaveBeenCalledWith("Style");
});

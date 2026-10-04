import React from "react";
import { Keyboard, AccessibilityInfo } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Screen, SearchBar } from "../stylematch/UI";
import { useSettings } from "./settings";
import { themes } from "./theme";

beforeEach(() => {
  useSettings.setState({ appearance: "light", language: "en", ready: true });
  jest
    .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
    .mockResolvedValue(true);
});
afterEach(() => jest.restoreAllMocks());
function Search() {
  const [value, setValue] = React.useState("");
  return (
    <Screen testID="search-screen">
      <SearchBar
        value={value}
        onChangeText={setValue}
        accessibilityLabel="Search wardrobe"
        placeholder="Find a favorite piece…"
      />
    </Screen>
  );
}
test("dragging and submitting dismiss the keyboard without discarding the query", async () => {
  const dismiss = jest.spyOn(Keyboard, "dismiss");
  await render(<Search />);
  const input = screen.getByLabelText("Search wardrobe");
  await fireEvent.changeText(input, "linen");
  await fireEvent(screen.getByTestId("search-screen"), "scrollBeginDrag");
  expect(dismiss).toHaveBeenCalledTimes(1);
  expect(input.props.value).toBe("linen");
  await fireEvent(input, "submitEditing");
  expect(dismiss).toHaveBeenCalledTimes(2);
  await fireEvent.press(screen.getByRole("button", { name: "Clear search" }));
  expect(input.props.value).toBe("");
  expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
});
test.each(["light", "dark"])(
  "search text and placeholder stay legible in %s mode",
  async (appearance) => {
    useSettings.setState({ appearance, language: "ja" });
    await render(<Search />);
    const input = screen.getByLabelText("服を検索");
    await fireEvent.changeText(input, "シャツ");
    expect(input).toHaveStyle({
      color: themes[appearance].colors.ink,
      fontSize: 16,
      minHeight: 52,
    });
    expect(input.props.placeholderTextColor).toBe(
      themes[appearance].colors.muted,
    );
    expect(
      screen.getByRole("button", { name: "検索をクリア" }),
    ).toBeOnTheScreen();
  },
);

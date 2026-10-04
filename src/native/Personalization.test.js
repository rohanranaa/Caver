import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccessibilityInfo } from "react-native";
import SettingsScreen from "./SettingsScreen";
import { useSettings } from "./settings";
import { themes } from "./theme";
import { translate } from "./i18n";
import LaunchAnimation from "./LaunchAnimation";
import SkinPalette from "./SkinPalette";
import { INITIAL_PROFILE } from "../stylematch/data";
import { suggestedPalette } from "../stylematch/skinPalette";
beforeEach(() =>
  useSettings.setState({ appearance: "light", language: "en", ready: true }),
);
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});
test("appearance and Japanese persist without changing stored enum values", async () => {
  await render(<SettingsScreen />);
  await fireEvent.press(screen.getByRole("button", { name: "Dark" }));
  await fireEvent.press(screen.getByRole("button", { name: "Japanese" }));
  expect(useSettings.getState()).toMatchObject({
    appearance: "dark",
    language: "ja",
  });
  expect(screen.getByText("表示モード")).toBeOnTheScreen();
  expect(screen.getByRole("button", { name: "ダーク" })).toBeOnTheScreen();
  await waitFor(() =>
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "stylematch:settings:v1",
      expect.stringContaining('"language":"ja"'),
    ),
  );
  expect(themes.dark.s.card.backgroundColor).toBe(themes.dark.colors.card);
  expect(themes.dark.s.input.backgroundColor).toBe(themes.dark.colors.card);
  expect(themes.dark.colors.bg).not.toBe(themes.light.colors.bg);
  expect(translate("Tops", "ja")).toBe("トップス");
  expect(translate("Shop suggestions · Tops, Shoes", "ja")).toBe(
    "購入候補 · トップス、シューズ",
  );
  expect(
    translate(
      "Add tops and shoes that suit casual and the weather to complete this look.",
      "ja",
    ),
  ).toContain("トップス、シューズ");
  expect(translate("My own name", "ja")).toBe("My own name");
});
test.each(["light", "dark"])(
  "%s launch has unique keys, lasts about two seconds and respects reduced motion",
  async (appearance) => {
    useSettings.setState({ appearance });
    const errors = jest.spyOn(console, "error");
    jest.useFakeTimers();
    jest
      .spyOn(AccessibilityInfo, "isReduceMotionEnabled")
      .mockResolvedValue(true);
    const finish = jest.fn();
    await render(<LaunchAnimation onFinish={finish} />);
    await act(async () => jest.advanceTimersByTime(2000));
    expect(finish).not.toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(100));
    expect(finish).toHaveBeenCalledTimes(1);
    expect(
      errors.mock.calls.some((args) =>
        args.some((value) => String(value).includes("same key")),
      ),
    ).toBe(false);
  },
);
test("manual shade and palette selection preserve opt-in and disjoint preference lists", async () => {
  function Form() {
    const [draft, setDraft] = React.useState({
      ...INITIAL_PROFILE,
      avoidColors: ["Cream", "Teal"],
    });
    return (
      <SkinPalette
        draft={draft}
        setDraft={(next) => {
          setDraft((current) => {
            const result = typeof next === "function" ? next(current) : next;
            Form.last = result;
            return result;
          });
        }}
      />
    );
  }
  await render(<Form />);
  await fireEvent.press(screen.getByRole("button", { name: "Skin shade S10" }));
  expect(Form.last).toMatchObject({ tone: "Deep", skinHex: "#492F24" });
  await fireEvent.press(
    screen.getByRole("button", { name: "Use this suggested palette" }),
  );
  expect(Form.last.glowColors).toContain("Cream");
  expect(
    Form.last.glowColors.some((color) => Form.last.avoidColors.includes(color)),
  ).toBe(false);
  expect(suggestedPalette("Deep", "Warm").glowColors).not.toEqual(
    suggestedPalette("Light", "Cool").glowColors,
  );
});

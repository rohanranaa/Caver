import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ClothingScreen } from "./EditScreens";
import { useStyleStore, initialData } from "./store";
import { analyzePhoto } from "../platform/outfitAnalysis";
import { useSettings } from "./settings";
jest.mock("./AuthContext", () => ({
  useAuth: () => ({ session: { access_token: "synthetic-token" } }),
}));
jest.mock("../platform/outfitAnalysis", () => ({
  analysisConfigured: true,
  analyzePhoto: jest.fn(),
}));
test("clothing analysis needs consent and reviewed tags are editable before saving", async () => {
  useSettings.setState({ language: "en" });
  const item = {
    ...initialData().items[0],
    image: "data:image/png;base64,AA==",
  };
  useStyleStore.setState({ ...initialData(), items: [item], ready: true });
  analyzePhoto.mockResolvedValue({
    detected: true,
    category: "Accessories",
    type: "hat",
    color: "Blue",
    colorHex: "#123456",
    confidence: "medium",
    explanation: "Estimated blue hat.",
  });
  const goBack = jest.fn();
  await render(
    <ClothingScreen
      navigation={{ goBack }}
      route={{ params: { id: item.id } }}
    />,
  );
  expect(
    screen.getByRole("button", { name: "Analyze clothing photo" }),
  ).toBeDisabled();
  await fireEvent(
    screen.getByRole("switch", { name: "Allow clothing analysis" }),
    "valueChange",
    true,
  );
  await fireEvent.press(
    screen.getByRole("button", { name: "Analyze clothing photo" }),
  );
  expect(useStyleStore.getState().items[0].category).toBe("Tops");
  await fireEvent.press(
    screen.getByRole("button", { name: "Apply suggested tags" }),
  );
  await fireEvent.changeText(
    screen.getByLabelText("Color HEX code"),
    "#654321",
  );
  await fireEvent.press(screen.getByRole("button", { name: "Save changes" }));
  expect(useStyleStore.getState().items[0]).toMatchObject({
    category: "Accessories",
    type: "hat",
    colorHex: "#654321",
  });
  expect(analyzePhoto).toHaveBeenCalledTimes(1);
});

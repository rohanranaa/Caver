import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { initialData, useStyleStore } from "./store";
import OutfitCheckScreen from "./OutfitCheckScreen";
test("manual complete outfits can request and remove a replacement category", async () => {
  useStyleStore.setState({ ...initialData(), ready: true });
  const navigate = jest.fn();
  await render(
    <OutfitCheckScreen
      navigation={{ navigate }}
      route={{ params: { items: initialData().items.slice(0, 3) } }}
    />,
  );
  expect(screen.queryByRole("button", { name: /Shop suggestions/ })).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "Shoes" }));
  await fireEvent.press(
    screen.getByRole("button", { name: "Shop suggestions · Shoes" }),
  );
  expect(navigate).toHaveBeenCalledWith("Discover", { categories: ["Shoes"] });
  await fireEvent.press(screen.getByRole("button", { name: "Shoes" }));
  expect(screen.queryByRole("button", { name: /Shop suggestions/ })).toBeNull();
});

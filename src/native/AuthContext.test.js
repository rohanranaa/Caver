import React from "react";
import { Text, Button } from "react-native";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStyleStore, initialData } from "./store";
jest.unmock("./AuthContext");
let mockListener;
const mockSignOut = jest.fn();
jest.mock("../platform/auth", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (callback) => {
        mockListener = callback;
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      },
      startAutoRefresh: jest.fn(),
      stopAutoRefresh: jest.fn(),
      signOut: (...args) => mockSignOut(...args),
    },
  },
}));
import { AuthProvider, useAuth } from "./AuthContext";
function Status() {
  const auth = useAuth();
  return (
    <>
      <Text>{auth.ready ? auth.session?.user.id || "guest" : "loading"}</Text>
      <Button title="Logout test" onPress={auth.logout} />
    </>
  );
}
test("auth events hide a prior wardrobe and logout clears the session before guest access", async () => {
  await AsyncStorage.clear();
  useStyleStore.setState({ ...initialData(), ready: true, accountId: "guest" });
  await render(
    <AuthProvider>
      <Status />
    </AuthProvider>,
  );
  await act(async () =>
    mockListener("INITIAL_SESSION", { user: { id: "user-a" } }),
  );
  await waitFor(() => expect(screen.getByText("user-a")).toBeOnTheScreen());
  expect(useStyleStore.getState().items).toEqual([]);
  mockSignOut.mockImplementation(async () => {
    mockListener("SIGNED_OUT", null);
    return { error: null };
  });
  await fireEvent.press(screen.getByRole("button", { name: "Logout test" }));
  await waitFor(() => expect(screen.getByText("guest")).toBeOnTheScreen());
  expect(useStyleStore.getState().accountId).toBe("guest");
  expect(mockSignOut).toHaveBeenCalledWith({ scope: "local" });
});

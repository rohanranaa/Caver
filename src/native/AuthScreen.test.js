import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import AuthScreen from "./AuthScreen";
import { supabase, socialSignIn } from "../platform/auth";
jest.mock("../platform/auth", () => ({
  authConfigured: true,
  supabase: { auth: { signUp: jest.fn(), signInWithPassword: jest.fn() } },
  socialSignIn: jest.fn(),
  redirectTo: () => "stylematch://auth/callback",
}));
beforeEach(() => jest.clearAllMocks());
test("new account shows email confirmation without claiming a successful session", async () => {
  supabase.auth.signUp.mockResolvedValue({
    data: { session: null },
    error: null,
  });
  await render(<AuthScreen />);
  await fireEvent.press(screen.getByRole("button", { name: "Create account" }));
  await fireEvent.changeText(
    screen.getByLabelText("Email"),
    "new@example.test",
  );
  await fireEvent.changeText(
    screen.getByLabelText("Password"),
    "test-password-123",
  );
  const buttons = screen.getAllByRole("button", { name: "Create account" });
  await fireEvent.press(buttons[buttons.length - 1]);
  expect(supabase.auth.signUp).toHaveBeenCalledWith(
    expect.objectContaining({ email: "new@example.test" }),
  );
  expect(screen.getByText(/Check your email to confirm/)).toBeOnTheScreen();
});
test("provider errors appear and Google/Apple dispatch the correct provider", async () => {
  socialSignIn
    .mockRejectedValueOnce(new Error("Provider unavailable"))
    .mockResolvedValue(undefined);
  await render(<AuthScreen />);
  await fireEvent.press(
    screen.getByRole("button", { name: "Continue with Google" }),
  );
  expect(screen.getByText("Provider unavailable")).toBeOnTheScreen();
  await fireEvent.press(
    screen.getByRole("button", { name: "Continue with Apple" }),
  );
  expect(socialSignIn.mock.calls.map((args) => args[0])).toEqual([
    "google",
    "apple",
  ]);
});

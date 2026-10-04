import React, { useState } from "react";
import { View, Text } from "react-native";
import { Screen, Heading, Input, Button, Choices } from "../stylematch/UI";
import { s } from "./theme";
import {
  authConfigured,
  supabase,
  socialSignIn,
  redirectTo,
} from "../platform/auth";
import { useAuth } from "./AuthContext";
export default function AuthScreen({ navigation }) {
  const auth = useAuth();
  const [mode, setMode] = useState("Log in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const run = async (fn) => {
    setBusy(true);
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setMessage(e.message || "Could not complete sign-in.");
    } finally {
      setBusy(false);
    }
  };
  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      throw new Error("Enter a valid email address.");
    if (password.length < 8)
      throw new Error("Use a password with at least 8 characters.");
    const result =
      mode === "Create account"
        ? await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: { name: name.trim() },
              emailRedirectTo: redirectTo(),
            },
          })
        : await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
    if (result.error) throw result.error;
    setPassword("");
    if (mode === "Create account" && !result.data.session)
      setMessage(
        "Check your email to confirm your account, then return here to log in.",
      );
  };
  if (auth.session)
    return (
      <Screen>
        <Heading
          title="Your account"
          subtitle={auth.session.user.email || "Signed in"}
        />
        <Text style={s.body}>
          Your wardrobe is stored on this device under your account. Cloud
          wardrobe sync is not enabled.
        </Text>
        <Button
          title="Log out"
          onPress={() => run(auth.logout)}
          disabled={busy}
        />
        {!!message && <Text style={s.error}>{message}</Text>}
      </Screen>
    );
  return (
    <Screen>
      <Text style={s.logo}>StyleMatch.</Text>
      <Heading
        eyebrow="YOUR WARDROBE. YOUR WAY."
        title={
          mode === "Create account"
            ? "Find your everyday style."
            : "Welcome to your style space."
        }
        subtitle="Save your style story on this device, with an account that’s yours."
      />
      <Choices
        label="Get started"
        values={["Log in", "Create account"]}
        value={mode}
        onChange={(value) => {
          setMode(value);
          setMessage("");
          setPassword("");
        }}
      />
      {!authConfigured && (
        <View style={s.info}>
          <Text style={s.small}>
            Account services are not connected yet. You can explore as a guest.
          </Text>
        </View>
      )}
      {mode === "Create account" && (
        <Input
          label="Your name"
          value={name}
          onChangeText={setName}
          maxLength={60}
        />
      )}
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={254}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        textContentType={mode === "Create account" ? "newPassword" : "password"}
      />
      <Button
        title={busy ? "Please wait…" : mode}
        disabled={busy || !authConfigured}
        onPress={() => run(submit)}
      />

      <Button
        title="Continue with Google"
        secondary
        disabled={busy || !authConfigured}
        onPress={() => run(() => socialSignIn("google"))}
      />
      <Button
        title="Continue with Apple"
        secondary
        disabled={busy || !authConfigured}
        onPress={() => run(() => socialSignIn("apple"))}
      />
      {!!message && (
        <Text accessibilityRole="alert" style={s.body}>
          {message}
        </Text>
      )}
      <Button
        title="Continue as guest"
        secondary
        disabled={busy}
        onPress={() => {
          auth.continueGuest();
          if (navigation?.canGoBack()) navigation.goBack();
        }}
      />
    </Screen>
  );
}

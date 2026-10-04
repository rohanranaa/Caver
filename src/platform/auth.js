import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import storage from "./authStorage";
WebBrowser.maybeCompleteAuthSession();
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const authConfigured = Boolean(url && key);
export const supabase = authConfigured
  ? createClient(url, key, {
      auth: {
        storage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: Platform.OS === "web",
        flowType: "pkce",
      },
    })
  : null;
export const redirectTo = () =>
  Platform.OS === "web"
    ? window.location.origin + "/"
    : makeRedirectUri({ scheme: "stylematch", path: "auth/callback" });
export async function socialSignIn(provider) {
  if (!supabase)
    throw new Error(
      "Account services are not configured yet. You can continue as a guest.",
    );
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo(),
      skipBrowserRedirect: Platform.OS !== "web",
    },
  });
  if (error) throw error;
  if (Platform.OS === "web") return;
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo());
  if (result.type !== "success") return;
  const callback = new URL(result.url);
  const code = callback.searchParams.get("code");
  if (!code)
    throw new Error(
      callback.searchParams.get("error_description") ||
        "Sign-in was not completed. Please retry.",
    );
  const session = await supabase.auth.exchangeCodeForSession(code);
  if (session.error) throw session.error;
}

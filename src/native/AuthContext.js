import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { supabase } from "../platform/auth";
import { useStyleStore } from "./store";
const Context = createContext(null);
export const useAuth = () => useContext(Context);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [guest, setGuest] = useState(false);
  const [error, setError] = useState("");
  const hydrated = useStyleStore((state) => state.ready);
  useEffect(() => {
    if (!hydrated) return;
    let active = true,
      queue = Promise.resolve();
    const apply = (next) => {
      if (
        active &&
        useStyleStore.getState().accountId !== (next?.user?.id || "guest")
      )
        setReady(false);
      queue = queue
        .then(async () => {
          await useStyleStore.getState().switchAccount(next?.user || null);
          if (active) {
            setSession(next);
            setReady(true);
            setError("");
          }
        })
        .catch(() => {
          if (active) {
            setError(
              "Could not load your local wardrobe. Please restart the app.",
            );
            setReady(false);
          }
        });
    };
    if (!supabase) {
      apply(null);
      return () => {
        active = false;
      };
    }
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      apply(next);
    });
    const state = AppState.addEventListener("change", (value) => {
      if (value === "active") supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
      state.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, [hydrated]);
  const logout = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
    setGuest(false);
  };
  return (
    <Context.Provider
      value={{
        session,
        ready,
        guest,
        error,
        continueGuest: () => setGuest(true),
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}

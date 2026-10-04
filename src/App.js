import React, { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text, Pressable } from "./native/i18n";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import Feather from "@expo/vector-icons/Feather";
import { useStyleStore } from "./native/store";
import {
  HomeScreen,
  WardrobeScreen,
  LooksScreen,
  ProfileScreen,
} from "./native/MainScreens";
import {
  StyleScreen,
  ResultScreen,
  DiscoverScreen,
  ProductScreen,
} from "./native/StylingScreens";
import {
  ClothingScreen,
  ClothingDetailScreen,
  PreferencesScreen,
  ColorIntroScreen,
} from "./native/EditScreens";
import { AuthProvider, useAuth } from "./native/AuthContext";
import AuthScreen from "./native/AuthScreen";
import OutfitCheckScreen from "./native/OutfitCheckScreen";
import WeatherScreen from "./native/WeatherScreen";
import { useT } from "./native/i18n";
import { useSettings } from "./native/settings";
import SettingsScreen from "./native/SettingsScreen";
import LaunchAnimation from "./native/LaunchAnimation";
import Icon from "./stylematch/Icon";
import { useTheme } from "./native/theme";
const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function MainTabs() {
  const t = useT();
  const language = useSettings((state) => state.language);
  const { s, colors, dark } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: t(route.name === "Looks" ? "My looks" : route.name),
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
          height: 76,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          paddingTop: 4,
          fontFamily: language === "ja" ? "StyleMatchJapanese" : undefined,
        },
        tabBarIcon: ({ color }) => (
          <Icon
            name={
              {
                Home: "home",
                Wardrobe: "wardrobe",
                Looks: "heart",
                Profile: "user",
              }[route.name]
            }
            color={color}
            size={21}
          />
        ),
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tabs.Screen
        name="Looks"
        component={LooksScreen}
        options={{ tabBarLabel: t("My looks") }}
      />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
function AppContent() {
  const t = useT();
  const language = useSettings((state) => state.language);
  const settingsReady = useSettings((state) => state.ready);
  const [launchDone, setLaunchDone] = useState(false);
  const finishLaunch = useCallback(() => setLaunchDone(true), []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const style = document.createElement("style");
    style.textContent =
      "* { scrollbar-width: none; } *::-webkit-scrollbar { display: none; }";
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const { s, colors, dark } = useTheme();

  const theme = {
    ...DefaultTheme,
    dark,
    colors: {
      ...DefaultTheme.colors,
      background: colors.bg,
      card: colors.bg,
      text: colors.ink,
      primary: colors.green,
      border: colors.line,
    },
  };

  const auth = useAuth();
  const ready = useStyleStore((state) => state.ready);
  const notice = useStyleStore((state) => state.notice);
  const dismiss = useStyleStore((state) => state.dismiss);
  const [fontsLoaded, fontError] = useFonts({
    ...Feather.font,
    StyleMatchJapanese: require("../assets/fonts/NotoSansJP.ttf"),
  });
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(dismiss, 5000);
    return () => clearTimeout(timeout);
  }, [notice, dismiss]);
  return (
    <SafeAreaProvider>
      <StatusBar style={dark ? "light" : "dark"} />
      <SafeAreaView
        style={[s.fill, { backgroundColor: colors.bg }]}
        edges={["top", "left", "right"]}
      >
        {!launchDone ? (
          <LaunchAnimation onFinish={finishLaunch} />
        ) : !settingsReady ||
          !ready ||
          !auth.ready ||
          (!fontsLoaded && !fontError) ? (
          <View
            style={[
              s.screen,
              { alignItems: "center", justifyContent: "center", gap: 20 },
            ]}
          >
            <Text style={s.logo}>StyleMatch.</Text>
            <ActivityIndicator color={colors.green} />
            {!!auth.error && <Text style={s.error}>{auth.error}</Text>}
          </View>
        ) : !auth.session && !auth.guest ? (
          <AuthScreen />
        ) : (
          <NavigationContainer theme={theme}>
            <Stack.Navigator
              initialRouteName="Main"
              screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: colors.bg },
                headerTintColor: colors.green,
                headerTitleStyle: {
                  fontSize: 16,
                  fontFamily:
                    language === "ja" ? "StyleMatchJapanese" : undefined,
                },
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: t("Settings") }}
              />
              <Stack.Screen
                name="Account"
                component={AuthScreen}
                options={{ title: t("Your account"), presentation: "modal" }}
              />
              <Stack.Screen
                name="OutfitCheck"
                component={OutfitCheckScreen}
                options={{ title: t("Outfit check") }}
              />
              <Stack.Screen
                name="Main"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Style"
                component={StyleScreen}
                options={{ title: t("Style me") }}
              />
              <Stack.Screen
                name="Result"
                component={ResultScreen}
                options={{ title: t("Your look") }}
              />
              <Stack.Screen
                name="Clothing"
                component={ClothingScreen}
                options={{ title: t("Your wardrobe") }}
              />
              <Stack.Screen
                name="ClothingDetail"
                component={ClothingDetailScreen}
                options={{ title: t("A piece you love") }}
              />
              <Stack.Screen
                name="Preferences"
                component={PreferencesScreen}
                options={{ title: t("Your style profile") }}
              />
              <Stack.Screen
                name="ColorIntro"
                component={ColorIntroScreen}
                options={{ title: t("Your colors") }}
              />
              <Stack.Screen
                name="Weather"
                component={WeatherScreen}
                options={{ title: t("Dress for the day") }}
              />
              <Stack.Screen
                name="Discover"
                component={DiscoverScreen}
                options={{ title: t("Discover") }}
              />
              <Stack.Screen
                name="Product"
                component={ProductScreen}
                options={{ title: t("A thoughtful addition") }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )}
        {!!notice && (
          <View accessibilityLiveRegion="polite" style={s.toast}>
            <Icon name="check" size={18} />
            <Text style={[s.small, { flex: 1 }]}>{notice}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Dismiss notification"
              onPress={dismiss}
              hitSlop={12}
            >
              <Icon name="close" size={17} />
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

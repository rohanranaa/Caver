import React, { useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
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
import Icon from "./stylematch/Icon";
import { s, colors } from "./native/theme";
const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.ink,
    primary: colors.green,
    border: colors.line,
  },
};
function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: "#8b9380",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: colors.line,
          height: 76,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: { fontSize: 10, paddingTop: 4 },
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
        options={{ tabBarLabel: "My looks" }}
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
  const auth = useAuth();
  const ready = useStyleStore((state) => state.ready);
  const notice = useStyleStore((state) => state.notice);
  const dismiss = useStyleStore((state) => state.dismiss);
  const [fontsLoaded, fontError] = useFonts(Feather.font);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(dismiss, 5000);
    return () => clearTimeout(timeout);
  }, [notice, dismiss]);
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={s.fill} edges={["top", "left", "right"]}>
        {!ready || !auth.ready || (!fontsLoaded && !fontError) ? (
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
                headerTitleStyle: { fontSize: 16 },
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen
                name="Account"
                component={AuthScreen}
                options={{ title: "Your account", presentation: "modal" }}
              />
              <Stack.Screen
                name="OutfitCheck"
                component={OutfitCheckScreen}
                options={{ title: "Outfit check" }}
              />
              <Stack.Screen
                name="Main"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Style"
                component={StyleScreen}
                options={{ title: "Style me" }}
              />
              <Stack.Screen
                name="Result"
                component={ResultScreen}
                options={{ title: "Your look" }}
              />
              <Stack.Screen
                name="Clothing"
                component={ClothingScreen}
                options={{ title: "Your wardrobe" }}
              />
              <Stack.Screen
                name="ClothingDetail"
                component={ClothingDetailScreen}
                options={{ title: "A piece you love" }}
              />
              <Stack.Screen
                name="Preferences"
                component={PreferencesScreen}
                options={{ title: "Your style profile" }}
              />
              <Stack.Screen
                name="ColorIntro"
                component={ColorIntroScreen}
                options={{ title: "Your colors" }}
              />
              <Stack.Screen
                name="Weather"
                component={WeatherScreen}
                options={{ title: "Dress for the day" }}
              />
              <Stack.Screen
                name="Discover"
                component={DiscoverScreen}
                options={{ title: "Discover" }}
              />
              <Stack.Screen
                name="Product"
                component={ProductScreen}
                options={{ title: "A thoughtful addition" }}
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

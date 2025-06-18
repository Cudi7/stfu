import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/lib/supabase";

import { Session } from "@supabase/supabase-js";
import "../global.css";

import MiniPlayer from "@/components/player/MiniPlayer";
import { PostsProvider } from "@/contexts/PostsContext";
import { usePlayerStore } from "@/stores/usePlayerStore";

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    usePlayerStore.getState().initializeListener();
  }, []);

  // Handle font loading errors
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Handle initial loading and Supabase session
  useEffect(() => {
    if (!loaded) return;

    SplashScreen.hideAsync();

    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
      })
      .catch((err) => {
        console.error("Error getting session:", err);
        setSession(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
      },
    );

    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") {
          supabase.auth.startAutoRefresh();
        } else {
          supabase.auth.stopAutoRefresh();
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
      appStateSubscription?.remove();
    };
  }, [loaded]);

  // Handle navigation based on auth state and current route segments
  useEffect(() => {
    if (authLoading || !loaded) return;

    // Check if the current route is the effective root (served by app/index.tsx)
    const isAtAppRoot = segments.length === 0;
    // Check if the current route is part of the onboarding flow
    const isOnboardingRoute =
      segments.length > 0 && segments[0] === "onboarding";

    if (session) {
      if (isOnboardingRoute || isAtAppRoot) {
        // If user is on any onboarding screen OR at the app root,
        // and they are logged in, redirect them to the main app content.
        router.replace("/(tabs)");
      }
    } else {
      if (isOnboardingRoute) {
        // If already in the onboarding flow (e.g. /onboarding/splash, /onboarding/welcome, /onboarding/signup),
        // let it proceed. The onboarding screens will handle their own navigation.
      } else {
        // If NOT on an onboarding route (this includes being at isAtAppRoot, or trying to access /tabs, etc.),
        // send to the start of onboarding.
        router.replace("/onboarding/splash");
      }
    }
  }, [session, authLoading, segments, loaded, router]);

  if (!loaded || authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            colorScheme === "dark"
              ? DarkTheme.colors.background
              : DefaultTheme.colors.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={
            colorScheme === "dark"
              ? DarkTheme.colors.text
              : DefaultTheme.colors.text
          }
        />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PostsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="account"
            options={{
              presentation: "modal",
              headerShown: true, // Show the header for the modal
              title: "Edit Profile", // Set a title for the header
            }}
          />
          <Stack.Screen
            name="player"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom", // Explicitly define the animation
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <MiniPlayer />
      </PostsProvider>
    </ThemeProvider>
  );
}

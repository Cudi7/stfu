"use client";

import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const navigateToWelcome = () => {
    router.replace("/onboarding/welcome");
  };

  useEffect(() => {
    // Animate logo appearance
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 600 }),
      withTiming(1, { duration: 200 }),
    );
    logoOpacity.value = withTiming(1, { duration: 600 });

    // Animate text appearance
    textOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));

    // Navigate after animation
    const timer = setTimeout(() => {
      runOnJS(navigateToWelcome)();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View
      className="flex-1 bg-black justify-center items-center"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      {/* Logo */}
      <Animated.View style={logoAnimatedStyle} className="items-center">
        <View className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl items-center justify-center mb-4">
          <Text className="text-white text-3xl font-bold">🎵</Text>
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View style={textAnimatedStyle}>
        <Text className="text-white text-4xl font-bold tracking-wider">
          STFU
        </Text>
      </Animated.View>
    </View>
  );
}

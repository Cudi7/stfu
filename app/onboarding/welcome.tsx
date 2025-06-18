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
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(50);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const loadingOpacity = useSharedValue(0);

  // Loading animation values
  const dot1Scale = useSharedValue(1);
  const dot2Scale = useSharedValue(1);
  const dot3Scale = useSharedValue(1);
  const progressWidth = useSharedValue(0);

  const navigateToSignup = () => {
    router.replace("/onboarding/signup");
  };

  useEffect(() => {
    // Animate title
    titleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    titleTranslateY.value = withDelay(300, withTiming(0, { duration: 800 }));

    // Animate logo
    logoOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    logoScale.value = withDelay(600, withTiming(1, { duration: 600 }));

    // Show loading animation after logo appears
    loadingOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));

    // Start loading animations
    setTimeout(() => {
      // Animated dots
      dot1Scale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 400 }),
          withTiming(1, { duration: 400 }),
        ),
        -1,
        false,
      );

      setTimeout(() => {
        dot2Scale.value = withRepeat(
          withSequence(
            withTiming(1.3, { duration: 400 }),
            withTiming(1, { duration: 400 }),
          ),
          -1,
          false,
        );
      }, 200);

      setTimeout(() => {
        dot3Scale.value = withRepeat(
          withSequence(
            withTiming(1.3, { duration: 400 }),
            withTiming(1, { duration: 400 }),
          ),
          -1,
          false,
        );
      }, 400);

      // Progress bar animation
      progressWidth.value = withTiming(100, { duration: 2500 });
    }, 1200);

    // Navigate after loading simulation (3.5 seconds total)
    setTimeout(() => {
      runOnJS(navigateToSignup)();
    }, 3800);
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  const dot1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot1Scale.value }],
  }));

  const dot2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot2Scale.value }],
  }));

  const dot3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dot3Scale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-8">
        <Animated.View
          style={titleAnimatedStyle}
          className="items-center mb-16"
        >
          <Text className="text-black text-5xl font-bold text-center leading-tight">
            Audio to{"\n"}
            Make{"\n"}
            Your Day
          </Text>
        </Animated.View>

        {/* Loading Animation */}
        <Animated.View
          style={loadingAnimatedStyle}
          className="items-center mb-16"
        >
          {/* Loading Dots */}
          <View className="flex-row items-center justify-center mb-6">
            <Animated.View
              style={dot1AnimatedStyle}
              className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full mx-1"
            />
            <Animated.View
              style={dot2AnimatedStyle}
              className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full mx-1"
            />
            <Animated.View
              style={dot3AnimatedStyle}
              className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full mx-1"
            />
          </View>

          {/* Progress Bar */}
          <View className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <Animated.View
              style={progressAnimatedStyle}
              className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full"
            />
          </View>

          {/* Loading Text */}
          <Text className="text-gray-600 text-sm mt-4">
            Setting up your audio experience...
          </Text>
        </Animated.View>

        {/* Logo */}
        <Animated.View style={logoAnimatedStyle} className="items-center">
          <View className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-2xl items-center justify-center mb-3">
            <Text className="text-white text-2xl">🎵</Text>
          </View>
          <Text className="text-black text-2xl font-bold tracking-wider">
            STFU
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

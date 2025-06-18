import { useColorScheme } from "@/hooks/useColorScheme";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "../ui/IconSymbol";
import { PlayPauseButton } from "./PlayPauseButton";
import { ProgressBar } from "./ProgressBar";

export default function MiniPlayer() {
  // console.log("rendering MiniPlayer");
  const segments = useSegments();

  const track = usePlayerStore((state) => state.track);
  const router = useRouter();
  const isPlayerScreenActive = segments[0] === "player";
  const isVisible = track !== null && !isPlayerScreenActive;

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const TAB_BAR_HEIGHT = 49 + insets.bottom;
  const translateY = React.useRef(new Animated.Value(100)).current;

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: isVisible ? 0 : 100,
      useNativeDriver: true,
      tension: 80,
      friction: 15,
    }).start();
  }, [isVisible]);

  if (!track) return null;

  const handleRedirect = () => {
    router.push("/player");
  };

  const handleControlPress = (action) => action();

  if (!isVisible) return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        bottom: TAB_BAR_HEIGHT,
        left: 10,
        right: 10,
        height: 64,
      }}
      className={`rounded-lg shadow-lg overflow-hidden ${
        isDark ? "bg-gray-800" : "bg-white"
      }`}
      // Add pointerEvents to ensure touch events work properly
      pointerEvents="box-none"
    >
      <View className="flex-1" pointerEvents="box-none">
        <View className="flex-1 flex-row items-center px-3">
          {/* Clickable Track Info Area */}
          <Pressable
            onPress={handleRedirect}
            className="flex-1 flex-row items-center"
            android_ripple={{ color: isDark ? "#374151" : "#f3f4f6" }}
          >
            <View
              className={`w-10 h-10 rounded-md justify-center items-center mr-3 ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <IconSymbol
                name="waveform"
                size={20}
                color={isDark ? "#fff" : "#666"}
              />
            </View>
            <View className="flex-1">
              <Text
                className={`text-sm font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`}
                numberOfLines={1}
              >
                {track.title}
              </Text>
              <Text
                className={`text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
                numberOfLines={1}
              >
                {track.username}
              </Text>
            </View>
          </Pressable>

          {/* Controls - Separate touch areas */}
          <View className="flex-row items-center pl-2">
            <Pressable
              onPress={() => handleControlPress(() => {})}
              className="p-2"
              android_ripple={{
                color: isDark ? "#374151" : "#f3f4f6",
                radius: 20,
              }}
            >
              <IconSymbol
                name="heart"
                size={24}
                color={isDark ? "#888" : "#666"}
              />
            </Pressable>

            <PlayPauseButton track={track}>
              {({ isPlaying, onPress }) => (
                <Pressable
                  onPress={() => handleControlPress(onPress)}
                  className="p-2"
                  android_ripple={{
                    color: isDark ? "#374151" : "#f3f4f6",
                    radius: 20,
                  }}
                >
                  <IconSymbol
                    name={isPlaying ? "pause.fill" : "play.fill"}
                    size={24}
                    color={isDark ? "#fff" : "#000"}
                  />
                </Pressable>
              )}
            </PlayPauseButton>
          </View>
        </View>

        <View pointerEvents="none">
          <ProgressBar />
        </View>
      </View>
    </Animated.View>
  );
}

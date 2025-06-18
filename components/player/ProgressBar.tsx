import { useColorScheme } from "@/hooks/useColorScheme";
import { formatTime } from "@/lib/utils";
import { usePlayerStore } from "@/stores/usePlayerStore";
import React, { useState } from "react";
import { GestureResponderEvent, Pressable, Text, View } from "react-native";
import { useShallow } from "zustand/shallow";

interface ProgressBarProps {
  displayDetails?: boolean;
}

export const ProgressBar = ({ displayDetails = false }: ProgressBarProps) => {
  const [barWidth, setBarWidth] = useState(0);
  const isDark = useColorScheme() === "dark";

  const { currentTime, duration, seekTo } = usePlayerStore(
    useShallow((state) => ({
      currentTime: state.currentTime,
      duration: state.duration,
      seekTo: state.seekTo,
    })),
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ✨ 3. Create a handler for when the user presses the bar
  const handlePress = (event: GestureResponderEvent) => {
    // We do nothing if the bar width isn't calculated yet or if there's no duration
    if (barWidth === 0 || duration === 0) return;

    const { locationX } = event.nativeEvent; // Get the tap's x-coordinate
    const newProgress = locationX / barWidth; // Calculate progress percentage (0 to 1)
    const newTime = newProgress * duration; // Calculate the new time in seconds
    seekTo(newTime); // Use our store action to seek
  };

  return (
    <View className="w-full">
      <Pressable
        // Only allow pressing when displayDetails is true
        disabled={!displayDetails}
        // The onPress event that triggers our seek logic
        onPress={handlePress}
        // Capture the layout of the bar to get its width
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
      >
        <View
          className={`rounded-full ${isDark ? "bg-white/20" : "bg-black/10"} ${
            displayDetails ? "h-2" : "h-1"
          }`}
          // This makes the entire bar "pressable", not just the colored part
        >
          <View
            className={`h-full rounded-full ${
              isDark ? "bg-white" : "bg-black"
            }`}
            style={{ width: `${progress}%` }}
          />
        </View>
      </Pressable>

      {displayDetails && (
        <View className="flex-row justify-between mt-2">
          <Text
            className={`text-xs font-mono ${
              isDark ? "text-white/70" : "text-black/70"
            }`}
          >
            {formatTime(currentTime)}
          </Text>
          <Text
            className={`text-xs font-mono ${
              isDark ? "text-white/70" : "text-black/70"
            }`}
          >
            {formatTime(duration)}
          </Text>
        </View>
      )}
    </View>
  );
};

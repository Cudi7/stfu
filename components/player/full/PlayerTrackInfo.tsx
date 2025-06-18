import { Track } from "@/stores/usePlayerStore";
import { Text, View } from "react-native";

interface PlayerTrackInfoProps {
  isDark: boolean;
  track: Track;
}

export function PlayerTrackInfo({ isDark, track }: PlayerTrackInfoProps) {
  return (
    <View className="w-full mb-8">
      <Text
        className={`text-3xl font-bold text-center mb-2 ${
          isDark ? "text-white" : "text-black"
        }`}
        numberOfLines={2}
      >
        {track.title}
      </Text>
      <Text
        className={`text-xl text-center ${
          isDark ? "text-white/70" : "text-black/70"
        }`}
        numberOfLines={1}
      >
        {track.username}
      </Text>
    </View>
  );
}

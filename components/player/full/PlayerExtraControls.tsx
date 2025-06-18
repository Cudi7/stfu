import { IconSymbol } from "@/components/ui/IconSymbol";
import { Track } from "@/stores/usePlayerStore";
import { Text, TouchableOpacity, View } from "react-native";

interface PlayerExtraControlsProps {
  isDark: boolean;
  track: Track;
  playbackRate: number;
  onCyclePlaybackRate: () => void;
  onShare: () => void;
}

export function PlayerExtraControls({
  isDark,
  playbackRate,
  onCyclePlaybackRate,
  onShare,
}: PlayerExtraControlsProps) {
  const iconColor = isDark ? "white" : "black";
  return (
    <View className="flex-row justify-between items-center w-full px-4">
      <TouchableOpacity
        onPress={onCyclePlaybackRate}
        className="w-16 px-4 py-2 rounded-full border border-white/20 items-center"
      >
        <Text
          className={`font-semibold text-sm ${
            isDark ? "text-white/80" : "text-black/80"
          }`}
        >
          {playbackRate}x
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onShare} className="p-3">
        <IconSymbol name="square.and.arrow.up" size={24} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

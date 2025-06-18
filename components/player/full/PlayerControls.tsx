import { PlayPauseButton } from "@/components/player/PlayPauseButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Track } from "@/stores/usePlayerStore";
import { TouchableOpacity, View } from "react-native";

interface PlayerControlsProps {
  isDark: boolean;
  track: Track;
  onSeekBackward: () => void;
  onSeekForward: () => void;
}

export function PlayerControls({
  isDark,
  track,
  onSeekBackward,
  onSeekForward,
}: PlayerControlsProps) {
  const iconColor = isDark ? "white" : "black";
  return (
    <View className="flex-row justify-center items-center w-full mb-8">
      <TouchableOpacity onPress={onSeekBackward} className="p-4">
        <IconSymbol name="backward.10" size={36} color={iconColor} />
      </TouchableOpacity>

      <View className="mx-8">
        <PlayPauseButton track={track}>
          {({ isPlaying, onPress }) => (
            <TouchableOpacity
              onPress={onPress}
              className="w-20 h-20 rounded-full justify-center items-center bg-white shadow-lg"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <IconSymbol
                name={isPlaying ? "pause.fill" : "play.fill"}
                size={44}
                color="black"
              />
            </TouchableOpacity>
          )}
        </PlayPauseButton>
      </View>

      <TouchableOpacity onPress={onSeekForward} className="p-4">
        <IconSymbol name="forward.10" size={36} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

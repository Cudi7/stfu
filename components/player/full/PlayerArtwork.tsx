import { IconSymbol } from "@/components/ui/IconSymbol";
import { View } from "react-native";

interface PlayerArtworkProps {
  isDark: boolean;
}

export function PlayerArtwork({ isDark }: PlayerArtworkProps) {
  return (
    <View className="w-full max-w-sm aspect-square mb-12">
      <View
        className={`w-full h-full rounded-2xl shadow-2xl ${
          isDark
            ? "bg-gradient-to-br from-purple-600 to-pink-600"
            : "bg-gradient-to-br from-blue-400 to-purple-500"
        }`}
        style={{
          shadowColor: isDark ? "#000" : "#666",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <View className="flex-1 justify-center items-center">
          <View className="w-24 h-24 bg-white/20 rounded-full justify-center items-center backdrop-blur-sm">
            <IconSymbol name="music.note" size={48} color="white" />
          </View>
        </View>
      </View>
    </View>
  );
}

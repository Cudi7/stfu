import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface PlayerHeaderProps {
  isDark: boolean;
}

export function PlayerHeader({ isDark }: PlayerHeaderProps) {
  const router = useRouter();
  const iconColor = isDark ? "white" : "black";

  return (
    <View className="flex-row justify-between items-center px-6 py-4">
      <TouchableOpacity onPress={() => router.back()} className="p-2">
        <IconSymbol name="chevron.down" size={28} color={iconColor} />
      </TouchableOpacity>
      <View className="flex-1 items-center">
        <Text
          className={`text-xs font-medium tracking-wider uppercase ${
            isDark ? "text-white/60" : "text-black/60"
          }`}
        >
          Now Playing
        </Text>
      </View>
      <TouchableOpacity onPress={() => {}} className="p-2">
        <IconSymbol name="heart" size={28} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
}

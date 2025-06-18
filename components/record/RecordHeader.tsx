import { IconSymbol } from "@/components/ui/IconSymbol";
import { Text, TouchableOpacity, View } from "react-native";

interface RecordHeaderProps {
  isDark: boolean;
}

export function RecordHeader({ isDark }: RecordHeaderProps) {
  return (
    <View
      className={`flex-row justify-between items-center px-4 py-3 border-b ${
        isDark ? "bg-black border-gray-800" : "bg-gray-100 border-gray-200"
      }`}
    >
      <Text
        className={`text-2xl font-bold ${isDark ? "text-white" : "text-black"}`}
      >
        Record
      </Text>
      <TouchableOpacity>
        <IconSymbol
          name="gearshape"
          size={24}
          color={isDark ? "#fff" : "#000"}
        />
      </TouchableOpacity>
    </View>
  );
}

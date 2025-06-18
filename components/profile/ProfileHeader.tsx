import { IconSymbol } from "@/components/ui/IconSymbol";
import { Profile } from "@/hooks/useProfile";
import {
  Alert,
  Button,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileHeaderProps {
  isDark: boolean;
  profile: Profile | null;
  onSignOut: () => void;
}

export function ProfileHeader({
  isDark,
  profile,
  onSignOut,
}: ProfileHeaderProps) {
  return (
    <View
      className={`flex-row justify-between items-center px-4 py-3 border-b ${
        isDark ? "border-neutral-700" : "border-neutral-300"
      }`}
    >
      <Text
        className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}
      >
        {profile?.username || "Profile"}
      </Text>
      <View className="flex-row items-center">
        <TouchableOpacity
          className="mr-4"
          onPress={() =>
            Alert.alert("Settings", "Settings screen coming soon!")
          }
        >
          <IconSymbol
            name="gearshape"
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <Button
          title="Sign Out"
          onPress={onSignOut}
          color={
            Platform.OS === "ios" ? "#FF3B30" : isDark ? "#b91c1c" : "#dc2626"
          }
        />
      </View>
    </View>
  );
}

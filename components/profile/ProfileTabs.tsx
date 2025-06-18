import { IconSymbol } from "@/components/ui/IconSymbol";
import { ActiveTab } from "@/hooks/useProfile";
import { TouchableOpacity, View } from "react-native";

interface ProfileTabsProps {
  isDark: boolean;
  activeTab: ActiveTab;
  onTabPress: (tab: ActiveTab) => void;
}

const TABS: { key: ActiveTab; icon: any }[] = [
  { key: "posts", icon: "grid" },
  { key: "likes", icon: "heart.fill" },
  { key: "saved", icon: "bookmark.fill" },
];

export function ProfileTabs({
  isDark,
  activeTab,
  onTabPress,
}: ProfileTabsProps) {
  return (
    <View
      className={`flex-row justify-center border-y ${
        isDark ? "border-neutral-700" : "border-neutral-300"
      }`}
    >
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabPress(tab.key)}
          className={`py-3 px-6 items-center flex-1 ${
            activeTab === tab.key ? "border-b-2 border-green-500" : ""
          }`}
        >
          <IconSymbol
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? "#1DB954" : isDark ? "#666" : "#AAA"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

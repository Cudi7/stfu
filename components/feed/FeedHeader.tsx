import { Text, TouchableOpacity, View } from "react-native";

interface FeedHeaderProps {
  activeTab: "foryou" | "following";
  setActiveTab: (tab: "foryou" | "following") => void;
}

export function FeedHeader({ activeTab, setActiveTab }: FeedHeaderProps) {
  const inactiveClass = "text-gray-500 font-bold text-lg";
  const activeClass = "text-white font-bold text-lg";

  return (
    <View className="flex-row justify-between items-center px-4 py-3 bg-black border-b border-gray-800">
      {/* Left Side: Logo */}
      <View className="w-1/4">
        <Text className="text-2xl font-bold text-white">STFU</Text>
      </View>

      {/* Center: Tabs */}
      <View className="flex-row justify-center items-center gap-6">
        <TouchableOpacity onPress={() => setActiveTab("foryou")}>
          <Text
            className={activeTab === "foryou" ? activeClass : inactiveClass}
          >
            For You
          </Text>
          {/* The underline indicator for the active tab */}
          {activeTab === "foryou" && (
            <View className="h-1 bg-white rounded-full mt-1" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("following")}>
          <Text
            className={activeTab === "following" ? activeClass : inactiveClass}
          >
            Following
          </Text>
          {/* The underline indicator for the active tab */}
          {activeTab === "following" && (
            <View className="h-1 bg-white rounded-full mt-1" />
          )}
        </TouchableOpacity>
      </View>

      {/* Right Side: Icons */}
      {/* <View className="w-1/4 flex-row justify-end">
        <TouchableOpacity>
          <IconSymbol name="bell" size={24} color="#fff" />
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

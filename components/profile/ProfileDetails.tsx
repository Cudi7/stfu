import { Profile } from "@/hooks/useProfile";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileDetailsProps {
  isDark: boolean;
  profile: Profile | null;
  postCount: number;
}

export function ProfileDetails({
  isDark,
  profile,
  postCount,
}: ProfileDetailsProps) {
  const router = useRouter();
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-neutral-400" : "text-neutral-600";

  return (
    <View className="items-center py-5 px-4">
      <Image
        source={{
          uri:
            profile?.avatar_url ||
            "https://pgaevpdhxebcacfzrmfs.supabase.co/storage/v1/object/public/assets/default-avatar.png",
        }}
        className="w-20 h-20 rounded-full bg-neutral-300 mb-3"
      />
      <Text className={`text-lg font-bold mb-1 ${textColor}`}>
        {profile?.full_name || profile?.username || "User"}
      </Text>
      <Text className={`text-sm text-center mb-4 px-5 ${subTextColor}`}>
        {profile?.website || "Edit your profile to add a bio and website!"}
      </Text>

      {/* Stats Section */}
      <View className="flex-row justify-around w-full mb-4">
        <View className="items-center min-w-[70px]">
          <Text className={`text-base font-bold ${textColor}`}>
            {postCount}
          </Text>
          <Text className={`text-xs mt-0.5 ${subTextColor}`}>Audios</Text>
        </View>
        <View className="items-center min-w-[70px]">
          <Text className={`text-base font-bold ${textColor}`}>0</Text>
          <Text className={`text-xs mt-0.5 ${subTextColor}`}>Followers</Text>
        </View>
        <View className="items-center min-w-[70px]">
          <Text className={`text-base font-bold ${textColor}`}>0</Text>
          <Text className={`text-xs mt-0.5 ${subTextColor}`}>Following</Text>
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-500 px-6 py-2 rounded-full"
        onPress={() => router.push("/account")}
      >
        <Text className="text-white font-semibold text-sm">Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

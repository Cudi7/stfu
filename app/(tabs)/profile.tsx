import { ProfileDetails } from "@/components/profile/ProfileDetails";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfilePostListItem } from "@/components/profile/ProfilePostListItem";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useProfile } from "@/hooks/useProfile";
import {
  ActivityIndicator,
  FlatList,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // The useProfile hook now returns the centrally managed, always-synced data
  const {
    loading,
    profile,
    activeTab,
    posts,
    setActiveTab,
    handleSignOut,
    handleDeleteAudio,
  } = useProfile();

  // The list of posts for the currently active tab
  const activePosts = posts[activeTab];

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-black" : "bg-neutral-100"}`}
    >
      <FlatList
        data={activePosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <ProfilePostListItem
              post={item}
              track={item}
              isDark={isDark}
              isOwnPost={activeTab === "posts"}
              onDelete={handleDeleteAudio}
            />
          </View>
        )}
        ListHeaderComponent={
          <>
            <ProfileHeader
              isDark={isDark}
              profile={profile}
              onSignOut={handleSignOut}
            />
            <ProfileDetails
              isDark={isDark}
              profile={profile}
              postCount={posts.posts.length}
            />
            <ProfileTabs
              isDark={isDark}
              activeTab={activeTab}
              onTabPress={setActiveTab}
            />
            {activePosts.length > 0 && <View style={{ paddingTop: 16 }} />}
          </>
        }
        ListEmptyComponent={() =>
          !loading ? (
            <Text
              className={`text-center mt-12 text-base ${
                isDark ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              {activeTab === "posts" && "You haven't posted any audios yet."}
              {activeTab === "likes" && "You haven't liked any audios yet."}
              {activeTab === "saved" && "You haven't saved any audios yet."}
            </Text>
          ) : null
        }
        ListFooterComponent={() =>
          loading && activePosts.length === 0 ? (
            <ActivityIndicator size="large" style={{ marginTop: 48 }} />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 96 }}
      />
    </SafeAreaView>
  );
}

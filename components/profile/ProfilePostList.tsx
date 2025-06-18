import { ActiveTab, AudioPost, Profile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Track } from "@/stores/usePlayerStore";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { ProfilePostListItem } from "./ProfilePostListItem";

const getAudioPublicUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  const { data } = supabase.storage.from("audio-clips").getPublicUrl(path);
  return data.publicUrl;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const mapAudioPostToTrack = (
  post: AudioPost,
  authorProfile?: Profile | null,
): Track => ({
  id: post.id,
  username: post.profiles?.username || authorProfile?.username || "You",
  title: post.title,
  duration: formatTime(post.duration_seconds),
  durationSeconds: post.duration_seconds,
  audioUrl: getAudioPublicUrl(post.audio_file_storage_path),
});

interface ProfilePostListProps {
  loading: boolean;
  isDark: boolean;
  posts: AudioPost[];
  activeTab: ActiveTab;
  profile: Profile | null;
  onDelete: (postId: string, storagePath: string) => void;
}

export function ProfilePostList({
  loading,
  isDark,
  posts,
  activeTab,
  profile,
  onDelete,
}: ProfilePostListProps) {
  if (loading && posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: AudioPost }) => (
    <ProfilePostListItem
      post={item}
      track={mapAudioPostToTrack(item, profile)}
      isDark={isDark}
      isOwnPost={activeTab === "posts"}
      onDelete={onDelete}
    />
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 96,
      }}
      ListEmptyComponent={() => (
        <Text
          className={`text-center mt-12 text-base ${
            isDark ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          You haven&apos;t {activeTab} any audios yet.
        </Text>
      )}
    />
  );
}

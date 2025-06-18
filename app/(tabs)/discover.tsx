import { PlayPauseButton } from "@/components/player/PlayPauseButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { PostForComponent, usePosts } from "@/contexts/PostsContext";
import { useCategories } from "@/hooks/useCategories";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePostInteractions } from "@/hooks/usePostInteractions";
import { useShareTrack } from "@/hooks/useShareTrack";

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const AudioCardComponent = ({ post }: { post: PostForComponent }) => {
  const { shareTrack } = useShareTrack();
  const isDark = useColorScheme() === "dark";

  const { isLiked, isSaved, likeCount, toggleLike, toggleSave } =
    usePostInteractions({
      postId: post.id,
      initialLikeCount: post.like_count,
      initialIsLiked: post.isLiked,
      initialIsSaved: post.isSaved,
    });

  const likeColor = isLiked ? "#FF3B30" : isDark ? "#888" : "#666";
  const saveColor = isSaved ? "#34B7F1" : isDark ? "#888" : "#666";
  const defaultColor = isDark ? "#888" : "#666";

  return (
    <View className="flex-col p-3 mb-2 rounded-lg bg-white dark:bg-zinc-800">
      {/* Top Row: Playback Info */}
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-lg justify-center items-center mr-3 bg-neutral-200 dark:bg-zinc-700">
          <IconSymbol name="waveform" size={24} color="#1DB954" />
        </View>
        <View className="flex-1">
          <Text
            className="text-base font-semibold text-black dark:text-white"
            numberOfLines={1}
          >
            {post.title}
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            {post.username}
          </Text>
        </View>
        <PlayPauseButton track={post}>
          {({ isPlaying, onPress }) => (
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-green-500 justify-center items-center"
              onPress={onPress}
            >
              <IconSymbol
                name={isPlaying ? "pause.fill" : "play.fill"}
                size={18}
                color="white"
              />
            </TouchableOpacity>
          )}
        </PlayPauseButton>
      </View>

      {/* Bottom Row: Stats & Interaction Buttons */}
      <View className="flex-row items-center mt-3">
        {/* Offset to align with the text content */}
        <View className="w-12 mr-3" />

        {/* Stats */}
        <Text className="text-xs text-neutral-500">
          {formatDuration(post.durationSeconds)}
        </Text>
        <Text className="text-xs text-neutral-500 mx-1">·</Text>
        <Text className="text-xs text-neutral-500">
          {post.listen_count.toLocaleString()} plays
        </Text>

        {/* Interaction Icons (aligned to the right) */}
        <View className="flex-1 flex-row justify-end items-center gap-4">
          <TouchableOpacity
            onPress={toggleLike}
            className="flex-row items-center gap-1"
          >
            <IconSymbol
              name={isLiked ? "heart.fill" : "heart"}
              size={18}
              color={likeColor}
            />
            <Text style={{ color: likeColor, fontSize: 12 }}>{likeCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-1">
            <IconSymbol name="message" size={18} color={defaultColor} />
            <Text style={{ color: defaultColor, fontSize: 12 }}>
              {post.comment_count}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => shareTrack(post)}>
            <IconSymbol
              name="square.and.arrow.up"
              size={18}
              color={defaultColor}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleSave}>
            <IconSymbol
              name={isSaved ? "bookmark.fill" : "bookmark"}
              size={18}
              color={saveColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const AudioCard = React.memo(AudioCardComponent);

// --- MAIN SCREEN ---
export default function DiscoverScreen() {
  const isDark = useColorScheme() === "dark";
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const { posts, loading: postsLoading, onRefresh, refreshing } = usePosts();

  React.useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      const generalCat = categories.find((cat) => cat.slug === "general");
      if (generalCat) setSelectedCategoryId(generalCat.id);
    }
  }, [categories, selectedCategoryId]);

  const filteredPosts = useMemo(() => {
    if (!selectedCategoryId) return [];
    return posts.filter((post) =>
      post.category_ids.includes(selectedCategoryId),
    );
  }, [posts, selectedCategoryId]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <FlatList
        data={filteredPosts}
        renderItem={({ item }) => <AudioCard post={item} />}
        keyExtractor={(item) => item.id}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={
          <>
            <View className="px-4 pt-3 pb-2">
              <Text className="text-3xl font-bold text-black dark:text-white">
                Discover
              </Text>
            </View>
            <View className="px-4 pb-4">
              <View className="flex-row items-center px-3 py-2.5 rounded-full bg-neutral-100 dark:bg-zinc-800">
                <IconSymbol
                  name="magnifyingglass"
                  size={20}
                  color={isDark ? "#888" : "#666"}
                />
                <TextInput
                  className="flex-1 ml-2 text-base text-black dark:text-white"
                  placeholder="Search..."
                  placeholderTextColor={isDark ? "#888" : "#666"}
                />
              </View>
            </View>
            <View className="mb-4">
              {categoriesLoading ? (
                <ActivityIndicator className="h-[40px]" />
              ) : (
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categories}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedCategoryId(item.id)}
                      className={`px-4 py-2 rounded-full ${
                        selectedCategoryId === item.id
                          ? "bg-green-500"
                          : "bg-neutral-100 dark:bg-zinc-800"
                      }`}
                    >
                      <Text
                        className={`font-semibold text-sm ${
                          selectedCategoryId === item.id
                            ? "text-white"
                            : "text-black dark:text-white"
                        }`}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
            <Text className="text-xl font-bold px-4 mb-3 text-black dark:text-white">
              {categories.find((c) => c.id === selectedCategoryId)?.name ||
                "Trending"}
            </Text>
          </>
        }
        ListEmptyComponent={
          !postsLoading ? (
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-neutral-500">
                No posts in this category.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          postsLoading && !refreshing ? (
            <ActivityIndicator className="my-4" />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </SafeAreaView>
  );
}

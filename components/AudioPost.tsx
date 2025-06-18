import { IconSymbol } from "@/components/ui/IconSymbol";
import { PostForComponent } from "@/contexts/PostsContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { useShareTrack } from "@/hooks/useShareTrack";
import { Track, usePlayerStore } from "@/stores/usePlayerStore";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { PlayPauseButton } from "./player/PlayPauseButton";

const formatTime = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// It's a "selector" component that subscribes to the player state
// and applies a style without causing the children to re-render.
const AudioPostWrapper = ({
  post,
  children,
}: {
  post: Track;
  children: React.ReactNode;
}) => {
  const isThisTrackActive = usePlayerStore(
    (state) => state.track?.id === post.id,
  );
  const isDark = useColorScheme() === "dark";

  return (
    <View
      className={`mb-0.5 py-4 px-4 ${isDark ? "bg-gray-900" : "bg-white"} ${
        isThisTrackActive ? "opacity-100" : "opacity-70"
      }`}
    >
      {children}
    </View>
  );
};

function AudioPostComponent({ post }: { post: PostForComponent }) {
  // console.log("rendering Audio Post Component", post.title);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { shareTrack } = useShareTrack();

  const { isLiked, isSaved, likeCount, toggleLike, toggleSave } =
    usePostInteractions({
      postId: post.id,
      initialLikeCount: post.like_count,
      initialIsLiked: post.isLiked,
      initialIsSaved: post.isSaved,
    });

  const likeColor = isLiked ? "#FF3B30" : isDark ? "#888" : "#666";
  const saveColor = isSaved ? "#34B7F1" : isDark ? "#888" : "#666";

  return (
    <AudioPostWrapper post={post}>
      {/* It will NOT re-render on playback progress. */}

      <Pressable
        onPress={() => {
          /* Navigate to profile later */
          console.log("navigating...");
        }}
      >
        {({ pressed }) => (
          <View className="flex-row items-center mb-3">
            <View
              className={`w-10 h-10 rounded-full justify-center items-center mr-3 ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              <IconSymbol
                name="person.fill"
                size={20}
                color={isDark ? "#fff" : "#666"}
              />
            </View>
            <View className="flex-1">
              <Text
                className={`text-base font-semibold ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                {post.username}
              </Text>
              <Text
                className={`text-xs mt-0.5 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatTime(post.durationSeconds)}
              </Text>
            </View>
            <TouchableOpacity>
              <IconSymbol
                name="ellipsis"
                size={20}
                color={isDark ? "#888" : "#666"}
              />
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
      {/* Audio Content */}
      <View className="mb-3 pl-13">
        <View className="flex-row items-center gap-4">
          <PlayPauseButton track={post}>
            {({ isPlaying, onPress }) => (
              <TouchableOpacity
                className="bg-green-500 rounded-full w-14 h-14 items-center justify-center"
                onPress={onPress}
              >
                <IconSymbol
                  name={isPlaying ? "pause.fill" : "play.fill"}
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
            )}
          </PlayPauseButton>
          <View className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-lg px-4 py-2">
            <Text
              className={`text-base font-medium mb-3 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {post.title}
            </Text>
          </View>
        </View>
      </View>
      {/* Interaction Buttons  */}
      <View className="flex-row items-center mt-2 pl-13">
        <TouchableOpacity
          className="flex-row items-center mr-5"
          onPress={toggleLike}
        >
          <IconSymbol
            name={isLiked ? "heart.fill" : "heart"}
            size={22}
            color={likeColor}
          />
          <Text className={`text-xs ml-1.5`} style={{ color: likeColor }}>
            {likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center mr-5">
          <IconSymbol
            name="message"
            size={22}
            color={isDark ? "#888" : "#666"}
          />
          <Text
            className={`text-xs ml-1.5 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {post?.comment_count ?? 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center mr-5"
          onPress={() => shareTrack(post)}
        >
          <IconSymbol
            name="square.and.arrow.up"
            size={22}
            color={isDark ? "#888" : "#666"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center ml-auto"
          onPress={toggleSave}
        >
          <IconSymbol
            name={isSaved ? "bookmark.fill" : "bookmark"}
            size={22}
            color={saveColor}
          />
        </TouchableOpacity>
      </View>
    </AudioPostWrapper>
  );
}

export const AudioPost = React.memo(AudioPostComponent);

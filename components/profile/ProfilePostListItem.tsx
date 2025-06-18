import { AudioPost } from "@/hooks/useProfile";
import { formatTime } from "@/lib/utils";
import { Track } from "@/stores/usePlayerStore";
import { Text, TouchableOpacity, View } from "react-native";
import { PlayPauseButton } from "../player/PlayPauseButton";
import { IconSymbol } from "../ui/IconSymbol";

interface ListItemProps {
  post: AudioPost;
  track: Track;
  isDark: boolean;
  isOwnPost: boolean;
  onDelete: (postId: string, storagePath: string) => void;
}

export function ProfilePostListItem({
  post,
  track,
  isDark,
  isOwnPost,
  onDelete,
}: ListItemProps) {
  return (
    <View
      className={`flex-row items-center p-3 mb-2 rounded-lg ${
        isDark ? "bg-gray-800" : "bg-neutral-200"
      }`}
    >
      <PlayPauseButton track={track}>
        {({ isPlaying, onPress }) => (
          <TouchableOpacity
            className="w-11 h-11 rounded-full bg-blue-500 justify-center items-center mr-3"
            onPress={onPress}
          >
            <IconSymbol
              name={isPlaying ? "pause.fill" : "play.fill"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        )}
      </PlayPauseButton>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold mb-1 ${
            isDark ? "text-white" : "text-black"
          }`}
          numberOfLines={1}
        >
          {post.title}
        </Text>
        <Text
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {post.profiles?.username ? `${post.profiles.username} • ` : ""}
          {formatTime(post.duration_seconds)} • {post.listen_count} plays
        </Text>
      </View>

      {isOwnPost && (
        <TouchableOpacity
          onPress={() => onDelete(post.id, post.audio_file_storage_path)}
          className="p-2"
        >
          <IconSymbol
            name="trash"
            size={20}
            color={isDark ? "#ff4444" : "#cc0000"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

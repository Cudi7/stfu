import { AudioPost } from "@/components/AudioPost";
import { PostForComponent } from "@/contexts/PostsContext";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";

interface FeedListProps {
  posts: PostForComponent[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export function FeedList({
  posts,
  loading,
  refreshing,
  onRefresh,
}: FeedListProps) {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8 bg-black">
        <IconSymbol name="person.3.sequence.fill" size={48} color="#555" />
        <Text className="text-xl font-bold text-white mt-4">
          Your Following Feed
        </Text>
        <Text className="text-base text-gray-400 text-center mt-2">
          This is your personal feed. Follow creators to see their posts here.
          Find new people on the `For You` feed or by exploring topics in
          `Discover`.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: PostForComponent }) => (
    <AudioPost post={item} />
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
      className="bg-black"
    />
  );
}

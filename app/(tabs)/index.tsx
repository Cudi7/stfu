import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedList } from "@/components/feed/FeedList";
import { usePosts } from "@/contexts/PostsContext";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen() {
  const { loading, posts, refreshing, onRefresh } = usePosts();

  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");

  const followedUserIds = new Set<string>();

  // 3. Filter the posts based on the active tab
  const displayedPosts = useMemo(() => {
    if (activeTab === "following") {
      return [];
    }
    return posts;
  }, [posts, activeTab, followedUserIds]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FeedHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <FeedList
        posts={displayedPosts}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
}

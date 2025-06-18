import { PostForComponent, usePosts } from "@/contexts/PostsContext";
import { supabase } from "@/lib/supabase";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
}

export type ActiveTab = "posts" | "likes" | "saved";

export function useProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("posts");

  const [filteredPosts, setFilteredPosts] = useState<
    Record<ActiveTab, PostForComponent[]>
  >({
    posts: [],
    likes: [],
    saved: [],
  });

  // ✨ 2. Get the global posts and loading state from our single source of truth
  const { posts: allPosts, loading: postsLoading } = usePosts();

  const handleSignOut = async () => {
    usePlayerStore.getState().closePlayer();
    await supabase.auth.signOut();
  };

  const handleDeleteAudio = useCallback(
    (postId: string, storagePath: string) => {
      Alert.alert(
        "Delete Audio",
        "Are you sure you want to delete this audio?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              const { track: currentTrack, closePlayer } =
                usePlayerStore.getState();
              if (currentTrack?.id === postId) {
                closePlayer();
              }
              await supabase.storage.from("audio-clips").remove([storagePath]);
              await supabase.from("audio_posts").delete().eq("id", postId);
            },
          },
        ],
      );
    },
    [],
  );

  // ✨ 3. This effect fetches the user's static profile just once.
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("id, username, full_name, avatar_url, website")
          .eq("id", user.id)
          .single();
        setProfile(data as Profile);
      }
    };

    fetchProfile();

    // Listen to auth changes to clear profile on sign out
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setFilteredPosts({ posts: [], likes: [], saved: [] });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // This second effect is ONLY for filtering.
  // It runs whenever the global list of posts changes or the profile is loaded.
  useEffect(() => {
    if (postsLoading || !profile) return;

    setFilteredPosts({
      posts: allPosts.filter((p) => p.username === profile.username),
      likes: allPosts.filter((p) => p.isLiked),
      saved: allPosts.filter((p) => p.isSaved),
    });

    // We're done loading when the posts are done loading.
    setLoading(postsLoading);
  }, [allPosts, postsLoading, profile]);

  return {
    loading,
    profile,
    activeTab,
    posts: filteredPosts,
    setActiveTab,
    handleSignOut,
    handleDeleteAudio,
  };
}

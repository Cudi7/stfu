import { supabase } from "@/lib/supabase";
import { Track } from "@/stores/usePlayerStore";
import { useCallback, useEffect, useRef, useState } from "react";

export interface PostFromDB {
  id: string;
  title: string;
  duration_seconds: number;
  audio_file_storage_path: string;
  like_count: number;
  comment_count: number;
  profiles: {
    username: string;
  } | null;
}

export interface PostForComponent extends Track {
  like_count: number;
  comment_count: number;
}

const resolveAudioUrl = (path: string): string => {
  if (path.startsWith("http")) {
    return path;
  }
  const { data } = supabase.storage.from("audio-clips").getPublicUrl(path);
  return data.publicUrl;
};

const mapPostToTrack = (post: PostFromDB): PostForComponent => {
  return {
    id: post.id,
    username: post.profiles?.username || "Unknown Artist",
    title: post.title,
    duration: "0:00",
    durationSeconds: post.duration_seconds,
    audioUrl: resolveAudioUrl(post.audio_file_storage_path),
    isLiked: false,
    like_count: post.like_count,
    comment_count: post.comment_count,
  };
};

export function useFeed() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostForComponent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Function for the initial fetch and manual pull-to-refresh
  const fetchPosts = useCallback(async () => {
    console.log("Fetching initial posts...");
    setRefreshing(true); // Show refresh indicator during fetch
    try {
      const { data, error } = await supabase
        .from("audio_posts")
        .select(
          `id, title, duration_seconds, audio_file_storage_path, like_count, comment_count, profiles!audio_posts_user_id_fkey(username)`,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      const mappedPosts = (data as PostFromDB[]).map(mapPostToTrack);
      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Run the initial fetch immediately so the user sees data.

    setLoading(true);
    fetchPosts().finally(() => setLoading(false));

    // Listen for authentication changes.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth event: ${event}`);

        // If a session exists, the user is signed in.
        // The event can be INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED, etc.
        if (session) {
          // Prevent creating duplicate channels
          if (!channelRef.current) {
            console.log("✅ Session confirmed, setting up real-time channel.");
            const channel = supabase.channel("realtime-audio-posts");
            channelRef.current = channel;

            channel
              .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "audio_posts" },
                (payload) => {
                  console.log(
                    "✅ Real-time change received!",
                    payload.eventType,
                  );
                  if (payload.eventType === "INSERT") {
                    const newPost = mapPostToTrack(payload.new as PostFromDB);
                    setPosts((currentPosts) => [newPost, ...currentPosts]);
                  } else if (payload.eventType === "UPDATE") {
                    const updatedPost = mapPostToTrack(
                      payload.new as PostFromDB,
                    );
                    setPosts((currentPosts) =>
                      currentPosts.map((p) =>
                        p.id === updatedPost.id ? updatedPost : p,
                      ),
                    );
                  } else if (payload.eventType === "DELETE") {
                    setPosts((currentPosts) =>
                      currentPosts.filter(
                        (p) => p.id !== (payload.old as any).id,
                      ),
                    );
                  }
                },
              )
              .subscribe((status, err) => {
                console.log(`📡 Subscription status: ${status}`);
                if (err) {
                  console.error("❌ Realtime subscription error:", err);
                }
              });
          }
        }

        // If the user signs out, clean up the channel.
        if (event === "SIGNED_OUT") {
          if (channelRef.current) {
            console.log("🧹 User signed out, removing real-time channel.");
            supabase.removeChannel(channelRef.current);
            channelRef.current = null;
          }
        }
      },
    );

    // The cleanup function runs when the component unmounts.
    return () => {
      console.log("🧹 Cleaning up auth listener and channel on unmount.");
      // Stop listening to auth changes
      authListener.subscription.unsubscribe();
      // Remove the real-time channel if it exists
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchPosts]);

  return { loading, posts, refreshing, onRefresh: fetchPosts };
}

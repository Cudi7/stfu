import { supabase } from "@/lib/supabase";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface PostFromDB {
  id: string;
  title: string;
  duration_seconds: number;
  audio_file_storage_path: string;
  like_count: number;
  comment_count: number;
  listen_count: number;
  profiles: { username: string } | null;
  audio_post_categories: { category_id: string }[];
}

export interface PostForComponent {
  id: string;
  username: string;
  title: string;
  duration: string;
  durationSeconds: number;
  audioUrl: string;
  like_count: number;
  comment_count: number;
  listen_count: number;
  category_ids: string[];
  isLiked: boolean;
  isSaved: boolean;
}

const resolveAudioUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) {
    return path;
  }
  const { data } = supabase.storage.from("audio-clips").getPublicUrl(path);
  return data.publicUrl;
};

const mapPostToComponent = (
  post: PostFromDB,
  likedIds: Set<string>,
  savedIds: Set<string>,
): PostForComponent => ({
  id: post.id,
  username: post.profiles?.username || "Unknown",
  title: post.title,
  duration: `${Math.floor(post.duration_seconds / 60)}:${(
    post.duration_seconds % 60
  )
    .toString()
    .padStart(2, "0")}`,
  durationSeconds: post.duration_seconds,
  audioUrl: resolveAudioUrl(post.audio_file_storage_path),
  like_count: post.like_count,
  comment_count: post.comment_count,
  listen_count: post.listen_count,
  category_ids: (post.audio_post_categories || []).map((c) => c.category_id),
  isLiked: likedIds.has(post.id),
  isSaved: savedIds.has(post.id),
});

interface PostsContextType {
  posts: PostForComponent[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostForComponent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchInitialData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const [postsRes, likesRes, savesRes] = await Promise.all([
        supabase
          .from("audio_posts")
          .select(
            `*, profiles:profiles!audio_posts_user_id_fkey(username), audio_post_categories(category_id)`,
          )
          .order("created_at", { ascending: false }),
        user
          ? supabase
              .from("user_likes")
              .select("audio_post_id")
              .eq("user_id", user.id)
          : Promise.resolve({ data: [] }),
        user
          ? supabase
              .from("user_saved_posts")
              .select("audio_post_id")
              .eq("user_id", user.id)
          : Promise.resolve({ data: [] }),
      ]);

      if (postsRes.error) throw postsRes.error;

      const likedPostIds = new Set(
        likesRes.data?.map((l: any) => l.audio_post_id) || [],
      );
      const savedPostIds = new Set(
        savesRes.data?.map((s: any) => s.audio_post_id) || [],
      );

      const mappedPosts = (postsRes.data as PostFromDB[]).map((post) =>
        mapPostToComponent(post, likedPostIds, savedPostIds),
      );

      setPosts(mappedPosts);
    } catch (error) {
      console.error("Failed to fetch initial posts:", error);
    } finally {
      if (!isRefresh) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // This useEffect now runs ONLY ONCE, creating a single, stable connection.
  useEffect(() => {
    fetchInitialData();

    const channel = supabase.channel("stfu-db-changes");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "audio_posts" },
        async (payload) => {
          const newPostId = payload.new.id;
          const { data: newPostData, error } = await supabase
            .from("audio_posts")
            .select(
              `*, profiles:profiles!audio_posts_user_id_fkey(username), audio_post_categories(category_id)`,
            )
            .eq("id", newPostId)
            .single();

          if (error || !newPostData) {
            console.error("Failed to fetch new post details:", error);
            return;
          }

          // A brand new post is never liked/saved yet. Pass empty sets.
          const newPost = mapPostToComponent(
            newPostData as PostFromDB,
            new Set<string>(),
            new Set<string>(),
          );

          setPosts((currentPosts) => [newPost, ...currentPosts]);
        },
      )

      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "audio_posts" },
        (payload) => {
          const deletedPostId = payload.old.id;
          if (deletedPostId) {
            setPosts((currentPosts) =>
              currentPosts.filter((p) => p.id !== deletedPostId),
            );
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_likes" },
        (payload) => {
          const postId =
            payload.new?.audio_post_id || payload.old?.audio_post_id;
          if (!postId) return;
          setPosts((currentPosts) =>
            currentPosts.map((p) =>
              p.id === postId
                ? { ...p, isLiked: payload.eventType === "INSERT" }
                : p,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_saved_posts" },
        (payload) => {
          const postId =
            payload.new?.audio_post_id || payload.old?.audio_post_id;
          if (!postId) return;
          setPosts((currentPosts) =>
            currentPosts.map((p) =>
              p.id === postId
                ? { ...p, isSaved: payload.eventType === "INSERT" }
                : p,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "audio_posts" },
        (payload) => {
          setPosts((currentPosts) =>
            currentPosts.map((p) => {
              if (p.id === payload.new.id) {
                return {
                  ...p,
                  like_count: payload.new.like_count,
                  comment_count: payload.new.comment_count,
                  listen_count: payload.new.listen_count,
                };
              }
              return p;
            }),
          );
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchInitialData]);

  const onRefresh = useCallback(() => {
    fetchInitialData(true);
  }, [fetchInitialData]);

  return (
    <PostsContext.Provider value={{ posts, loading, refreshing, onRefresh }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};

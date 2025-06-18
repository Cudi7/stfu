import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

interface UsePostInteractionsProps {
  postId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  initialIsSaved: boolean;
}

export const usePostInteractions = ({
  postId,
  initialLikeCount,
  initialIsLiked,
  initialIsSaved,
}: UsePostInteractionsProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  // This effect ensures the component's state syncs when the props from the context update
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setIsSaved(initialIsSaved);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialIsSaved, initialLikeCount]);

  const toggleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Please sign in", "You need to be signed in to like posts.");
      return;
    }

    const currentlyLiked = isLiked;
    // Optimistic UI update
    setIsLiked(!currentlyLiked);
    setLikeCount((prev) => (currentlyLiked ? prev - 1 : prev + 1));

    try {
      if (currentlyLiked) {
        // Unlike
        const { error } = await supabase
          .from("user_likes")
          .delete()
          .match({ user_id: user.id, audio_post_id: postId });
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("user_likes")
          .insert({ user_id: user.id, audio_post_id: postId });
        if (error) throw error;
      }
    } catch (error) {
      // Revert UI on failure
      console.error("Failed to toggle like:", error);
      setIsLiked(currentlyLiked);
      setLikeCount((prev) => (currentlyLiked ? prev + 1 : prev - 1));
    }
  };

  const toggleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Please sign in", "You need to be signed in to save posts.");
      return;
    }

    const currentlySaved = isSaved;
    setIsSaved(!currentlySaved); // Optimistic update

    try {
      if (currentlySaved) {
        // Unsave
        const { error } = await supabase
          .from("user_saved_posts")
          .delete()
          .match({ user_id: user.id, audio_post_id: postId });
        if (error) throw error;
      } else {
        // Save
        const { error } = await supabase
          .from("user_saved_posts")
          .insert({ user_id: user.id, audio_post_id: postId });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Failed to toggle save:", error);
      setIsSaved(currentlySaved); // Revert on failure
    }
  };

  return { isLiked, isSaved, likeCount, toggleLike, toggleSave };
};

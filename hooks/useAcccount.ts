import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useAccount() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        getProfile(session);
      } else {
        setLoading(false);
      }
    });
  }, []);

  async function getProfile(currentSession: Session) {
    try {
      setLoading(true);
      if (!currentSession?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", currentSession.user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    if (!session) return;
    try {
      setLoading(true);
      if (!session.user) throw new Error("No user on the session!");

      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    session,
    loading,
    username,
    setUsername,
    website,
    setWebsite,
    updateProfile,
  };
}

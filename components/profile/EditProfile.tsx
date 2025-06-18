import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  // CHANGED: The screen now manages its own session state.
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    // Fetch the session when the component mounts
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
      if (error && status !== 406) {
        throw error;
      }

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

  async function updateProfile({
    username,
    website,
  }: {
    username: string;
    website: string;
  }) {
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

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>You need to be signed in to view this page.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.textInput, styles.disabledInput]}
          value={session.user?.email}
          editable={false}
        />
      </View>

      {/* Username Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.textInput}
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
          autoCapitalize="none"
        />
      </View>

      {/* Website Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.textInput}
          value={website || ""}
          onChangeText={(text) => setWebsite(text)}
          autoCapitalize="none"
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => updateProfile({ username, website })}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Update</Text>
        )}
      </TouchableOpacity>

      {/* Sign Out Button */}
      <TouchableOpacity
        style={[styles.button, styles.signOutButton]}
        onPress={() => supabase.auth.signOut()}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  button: {
    backgroundColor: "#1DB954",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    minHeight: 48,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signOutButton: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

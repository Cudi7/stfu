import { AccountForm } from "@/components/account/AccountForm";
import { EmailDisplay } from "@/components/account/EmailDisplay";
import { useAccount } from "@/hooks/useAcccount";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/lib/supabase";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    session,
    loading,
    username,
    setUsername,
    website,
    setWebsite,
    updateProfile,
  } = useAccount();

  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-black" : "bg-gray-100"
        }`}
      >
        <ActivityIndicator size="large" color={isDark ? "#fff" : "#000"} />
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-black" : "bg-gray-100"
        }`}
      >
        <Text className="text-lg dark:text-white">
          You must be signed in to view this page.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 p-4 ${isDark ? "bg-black" : "bg-gray-100"}`}
    >
      <View>
        <EmailDisplay email={session.user?.email} />

        <AccountForm
          username={username}
          website={website}
          loading={loading}
          onUsernameChange={setUsername}
          onWebsiteChange={setWebsite}
          onUpdate={updateProfile}
        />

        {/* Sign Out Button */}
        <TouchableOpacity
          className="bg-red-600 dark:bg-red-700 py-3.5 rounded-lg items-center justify-center mt-4"
          onPress={() => supabase.auth.signOut()}
          disabled={loading}
        >
          <Text className="text-white text-base font-bold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

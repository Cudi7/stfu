import { useColorScheme } from "@/hooks/useColorScheme";
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <>
      <Stack.Screen options={{ title: "Oops!", headerBackTitle: "Back" }} />
      <SafeAreaView
        className={`flex-1 items-center justify-center p-5 ${
          isDark ? "bg-black" : "bg-gray-100"
        }`}
      >
        <View className="items-center">
          <Text
            className={`text-5xl font-bold mb-4 ${
              isDark ? "text-red-500" : "text-red-600"
            }`}
          >
            404
          </Text>
          <Text
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Screen Not Found
          </Text>
          <Text
            className={`text-base text-center mb-8 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Sorry, we couldn&apos;t find the screen you were looking for.
          </Text>

          <Link
            href="/"
            className="bg-green-500 rounded-full px-6 py-3 shadow-md"
          >
            <Text className="text-white font-bold text-base">
              Go to Home Screen
            </Text>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

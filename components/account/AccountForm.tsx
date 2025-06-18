import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AccountFormProps {
  username: string;
  website: string;
  loading: boolean;
  onUsernameChange: (text: string) => void;
  onWebsiteChange: (text: string) => void;
  onUpdate: () => void;
}

export function AccountForm({
  username,
  website,
  loading,
  onUsernameChange,
  onWebsiteChange,
  onUpdate,
}: AccountFormProps) {
  return (
    <>
      {/* Username Input */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Username
        </Text>
        <TextInput
          className="h-11 border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-base bg-white dark:bg-gray-900 text-black dark:text-white"
          value={username || ""}
          onChangeText={onUsernameChange}
          autoCapitalize="none"
        />
      </View>

      {/* Website Input */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Website
        </Text>
        <TextInput
          className="h-11 border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-base bg-white dark:bg-gray-900 text-black dark:text-white"
          value={website || ""}
          onChangeText={onWebsiteChange}
          autoCapitalize="none"
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity
        className="bg-green-500 py-3.5 rounded-lg items-center justify-center mt-2 min-h-[48px] disabled:opacity-70"
        onPress={onUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white text-base font-bold">Update</Text>
        )}
      </TouchableOpacity>
    </>
  );
}

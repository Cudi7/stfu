import { Text, TextInput, View } from "react-native";

interface EmailDisplayProps {
  email?: string;
}

export function EmailDisplay({ email }: EmailDisplayProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Email
      </Text>
      <TextInput
        className="h-11 border border-gray-300 dark:border-gray-600 rounded-lg px-3 text-base bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
        value={email}
        editable={false}
      />
    </View>
  );
}

import { PostRecordingForm } from "@/components/record/PostRecordingForm";
import { RecordHeader } from "@/components/record/RecordHeader";
import { RecordingControls } from "@/components/record/RecordingControls";
import { useCategories } from "@/hooks/useCategories";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRecording } from "@/hooks/useRecording";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecordScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const recording = useRecording();
  const categories = useCategories();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-black" : "bg-gray-100"}`}>
      <RecordHeader isDark={isDark} />

      <View className="flex-1 justify-center items-center px-8">
        <RecordingControls isDark={isDark} recording={recording} />

        {recording.hasRecording && !recording.isRecording && (
          <PostRecordingForm
            isDark={isDark}
            recording={recording}
            categories={categories}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

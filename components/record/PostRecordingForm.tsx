import { useAudioUpload } from "@/hooks/useAudioUpload";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CategorySelector } from "./CategorySelector";

interface PostRecordingFormProps {
  isDark: boolean;
  recording: {
    recordedUri: string | null;
    recordingTime: number;
    resetRecording: () => void;
  };
  categories: {
    categories: { id: string; name: string; slug: string }[];
    selectedCategoryIds: Set<string>;
    generalCategoryId: string | null;
    isLoading: boolean;
    toggleCategory: (categoryId: string) => void;
    resetToDefault: () => void;
  };
}

export function PostRecordingForm({
  isDark,
  recording,
  categories,
}: PostRecordingFormProps) {
  const [audioTitle, setAudioTitle] = useState("");
  const { uploadAudio, isUploading } = useAudioUpload();

  const handleShare = async () => {
    if (!recording.recordedUri) {
      Alert.alert("No Recording", "There's nothing to share yet.");
      return;
    }

    if (audioTitle.trim() === "") {
      Alert.alert("Title Required", "Please enter a title for your audio.");
      return;
    }

    if (categories.selectedCategoryIds.size === 0) {
      if (categories.generalCategoryId) {
        categories.toggleCategory(categories.generalCategoryId);
      } else {
        Alert.alert(
          "Category Required",
          "Please select at least one category for your audio.",
        );
        return;
      }
    }

    try {
      await uploadAudio({
        recordedUri: recording.recordedUri,
        title: audioTitle.trim(),
        recordingTime: recording.recordingTime,
        selectedCategoryIds: categories.selectedCategoryIds,
      });

      Alert.alert(
        "Audio Shared!",
        "Your audio has been successfully uploaded.",
      );

      // Reset form
      recording.resetRecording();
      setAudioTitle("");
      categories.resetToDefault();
    } catch (error: any) {
      console.error("Error during sharing process:", error);
      Alert.alert(
        "Sharing Error",
        error.message || "An unexpected error occurred during sharing.",
      );
    }
  };

  return (
    <View className="w-full items-center">
      {/* Input for Audio Title */}
      <View
        className={`w-full px-5 py-3 rounded-lg mb-3 ${
          isDark
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-300"
        }`}
      >
        <TextInput
          placeholder="Enter audio title..."
          placeholderTextColor={isDark ? "#aaa" : "#999"}
          value={audioTitle}
          onChangeText={setAudioTitle}
          className={`text-base ${isDark ? "text-white" : "text-black"}`}
          maxLength={100}
        />
      </View>

      {/* Category Selection */}
      <CategorySelector
        isDark={isDark}
        categories={categories.categories}
        selectedCategoryIds={categories.selectedCategoryIds}
        generalCategoryId={categories.generalCategoryId}
        isLoading={categories.isLoading}
        onToggleCategory={categories.toggleCategory}
      />

      {/* Share Button */}
      <TouchableOpacity
        className="bg-green-500 px-10 py-4 rounded-full mt-5 w-full items-center"
        onPress={handleShare}
        disabled={isUploading || audioTitle.trim() === ""}
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold">Share Audio</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { useState } from "react";

// Helper function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

interface UploadAudioParams {
  recordedUri: string;
  title: string;
  recordingTime: number;
  selectedCategoryIds: Set<string>;
}

export function useAudioUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAudio = async ({
    recordedUri,
    title,
    recordingTime,
    selectedCategoryIds,
  }: UploadAudioParams) => {
    setIsUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to share audio.");
      }

      // 1. Upload file to storage
      const base64 = await FileSystem.readAsStringAsync(recordedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = base64ToArrayBuffer(base64);
      const fileExt = recordedUri.split(".").pop()?.toLowerCase() || "m4a";
      let contentType = "audio/m4a"; // Default
      if (fileExt === "mp3") contentType = "audio/mpeg";
      else if (fileExt === "wav") contentType = "audio/wav";
      else if (fileExt === "caf") contentType = "audio/x-caf";
      const fileName = `${user.id}/${Date.now()}_recording.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("audio-clips")
        .upload(fileName, arrayBuffer, {
          contentType: contentType,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Call the RPC function to create the post and link categories together
      const { error: rpcError } = await supabase.rpc(
        "create_post_with_categories",
        {
          post_title: title,
          post_duration: recordingTime,
          post_audio_path: uploadData.path,
          category_ids: Array.from(selectedCategoryIds),
        },
      );

      if (rpcError) {
        // If this fails, we should ideally delete the orphaned audio file.

        console.error("Error calling database function:", rpcError);
        throw new Error(
          "An error occurred while saving the post. Please try again.",
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAudio,
    isUploading,
  };
}

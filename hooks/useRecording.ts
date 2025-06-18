import { usePlayerStore } from "@/stores/usePlayerStore";
import { AudioModule, RecordingPresets, useAudioRecorder } from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";

export function useRecording() {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert(
          "Permission denied",
          "Permission to access microphone was denied",
        );
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Failed to start recording");
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }

      if (audioRecorder.uri) {
        setRecordedUri(audioRecorder.uri);
      } else {
        console.error("Error: No recording URI found after stopping.");
        Alert.alert("Error", "No recording was saved.");
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert("Error", "Failed to stop recording");
      setIsRecording(false);
    }
  };

  const discardRecording = (showAlert = true) => {
    // If the track being discarded is the one playing globally, stop it.
    const { track, closePlayer } = usePlayerStore.getState();
    if (track?.audioUrl === recordedUri) {
      closePlayer();
    }

    setRecordedUri(null);
    setRecordingTime(0);
    if (showAlert) {
      Alert.alert("Discarded", "Recording has been discarded.");
    }
  };

  const toggleRecording = () => {
    // Case 1: We are in the "Reviewing" state (have a recording, but not actively recording).
    // This is the "Record Again" button's action.
    if (recordedUri && !isRecording) {
      discardRecording(false); // Discard the old one without an alert
      startRecording(); // Immediately start the new one
    }
    // Case 2: We are actively recording.
    // This is the "Stop" button's action.
    else if (isRecording) {
      stopRecording();
    }
    // Case 3: We are in the initial state (no recording exists yet).
    // This is the "Start Recording" button's action.
    else {
      startRecording();
    }
  };

  const resetRecording = () => {
    setRecordedUri(null);
    setRecordingTime(0);
  };

  // The hook returns a lean object, free of local playback state.
  return {
    isRecording,
    recordedUri,
    recordingTime,
    hasRecording: !!recordedUri,
    toggleRecording,
    discardRecording,
    resetRecording,
  };
}

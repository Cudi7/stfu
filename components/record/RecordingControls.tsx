import { PlayPauseButton } from "@/components/player/PlayPauseButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Track, usePlayerStore } from "@/stores/usePlayerStore";
import { Text, TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/shallow";

interface RecordingControlsProps {
  isDark: boolean;
  recording: {
    isRecording: boolean;
    hasRecording: boolean;
    recordingTime: number;
    recordedUri: string | null;
    toggleRecording: () => void;
    discardRecording: () => void;
  };
}

export function RecordingControls({
  isDark,
  recording,
}: RecordingControlsProps) {
  const {
    isRecording,
    hasRecording,
    recordingTime,
    recordedUri,
    toggleRecording,
    discardRecording,
  } = recording;

  // Create a temporary Track object for the PlayPauseButton when a recording exists.
  const tempTrack: Track | null = recordedUri
    ? {
        id: recordedUri,
        audioUrl: recordedUri,
        title: "Your New Recording",
        username: "You",
        durationSeconds: recordingTime,
        duration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60)
          .toString()
          .padStart(2, "0")}`,
      }
    : null;

  const isCurrentlyPlaying = usePlayerStore(
    useShallow(
      (state) =>
        state.track?.id === recordedUri && state.playerStatus === "PLAYING",
    ),
  );

  return (
    <>
      {/* Recording Time */}
      <Text
        className={`text-5xl font-bold mb-2 ${
          isDark ? "text-white" : "text-black"
        }`}
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {Math.floor(recordingTime / 60)
          .toString()
          .padStart(2, "0")}
        :{(recordingTime % 60).toString().padStart(2, "0")}
      </Text>

      {/* Recording Status */}
      <Text
        className={`text-base mb-10 ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {isRecording
          ? "Recording..."
          : hasRecording
          ? isCurrentlyPlaying
            ? "Playing..."
            : "Recording ready"
          : "Tap to start recording"}
      </Text>

      {/* Control Buttons */}
      <View className="flex-row items-center justify-center mb-10">
        {hasRecording && !isRecording && tempTrack ? (
          <>
            {/* Record Again Button (Left) */}
            <TouchableOpacity
              className="w-12 h-12 rounded-full justify-center items-center mx-5 bg-gray-500 bg-opacity-10"
              onPress={toggleRecording}
            >
              <IconSymbol
                name="mic.fill"
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>

            {/* Main Play/Pause Button (Center) */}
            <PlayPauseButton track={tempTrack}>
              {({ isPlaying, onPress }) => (
                <TouchableOpacity
                  className="w-20 h-20 rounded-full justify-center items-center shadow-lg bg-green-500"
                  style={{
                    transform: [{ scale: 1 }],
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                  onPress={onPress}
                >
                  <IconSymbol
                    name={isPlaying ? "pause.fill" : "play.fill"}
                    size={32}
                    color="#fff"
                  />
                </TouchableOpacity>
              )}
            </PlayPauseButton>

            {/* Discard Button (Right) */}
            <TouchableOpacity
              className="w-12 h-12 rounded-full justify-center items-center mx-5 bg-gray-500 bg-opacity-10"
              onPress={discardRecording}
            >
              <IconSymbol name="trash" size={24} color="#ff4444" />
            </TouchableOpacity>
          </>
        ) : (
          // --- RECORDING CONTROLS ---
          <TouchableOpacity
            className={`w-20 h-20 rounded-full justify-center items-center shadow-lg ${
              isRecording ? "bg-red-500" : "bg-green-500"
            }`}
            style={{
              transform: [{ scale: isRecording ? 1.1 : 1 }],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={toggleRecording}
          >
            <IconSymbol
              name={isRecording ? "stop.fill" : "mic.fill"}
              size={32}
              color="#fff"
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

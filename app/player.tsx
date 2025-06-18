import { PlayerArtwork } from "@/components/player/full/PlayerArtwork";
import { PlayerControls } from "@/components/player/full/PlayerControls";
import { PlayerExtraControls } from "@/components/player/full/PlayerExtraControls";
import { PlayerHeader } from "@/components/player/full/PlayerHeader";
import { PlayerTrackInfo } from "@/components/player/full/PlayerTrackInfo";
import { ProgressBar } from "@/components/player/ProgressBar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useShareTrack } from "@/hooks/useShareTrack";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/shallow";

export default function PlayerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { shareTrack } = useShareTrack();
  const { track, seekForward, seekBackward, playbackRate, cyclePlaybackRate } =
    usePlayerStore(
      useShallow((state) => ({
        track: state.track,
        seekForward: state.seekForward,
        seekBackward: state.seekBackward,
        playbackRate: state.playbackRate,
        cyclePlaybackRate: state.cyclePlaybackRate,
      })),
    );

  if (!track) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
        <Text className={isDark ? "text-white" : "text-black"}>
          No track is currently playing.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      {/* <LinearGradient
        colors={
          isDark
            ? ["#1a1a2e", "#16213e", "#0f0f23"]
            : ["#f8f9fa", "#e9ecef", "#dee2e6"]
        }
        className="flex-1"
      > */}
      <Stack.Screen options={{ headerShown: false }} />

      <PlayerHeader isDark={isDark} />

      <View className="flex-1 justify-center items-center px-8">
        <PlayerArtwork isDark={isDark} />
        <PlayerTrackInfo isDark={isDark} track={track} />

        <View className="w-full mb-8">
          <ProgressBar displayDetails={true} />
        </View>

        <PlayerControls
          isDark={isDark}
          track={track}
          onSeekBackward={seekBackward}
          onSeekForward={seekForward}
        />
        <PlayerExtraControls
          isDark={isDark}
          track={track}
          playbackRate={playbackRate}
          onCyclePlaybackRate={cyclePlaybackRate}
          onShare={() => shareTrack(track)}
        />
      </View>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
}

import { useIsThisTrackPlaying } from "@/hooks/useIsThisTrackPlaying";
import { Track, usePlayerStore } from "@/stores/usePlayerStore";
import React from "react";

interface PlayPauseButtonProps {
  track: Track;
  children: (props: {
    isPlaying: boolean;
    onPress: () => void;
  }) => React.ReactNode;
}

export const PlayPauseButton = ({ track, children }: PlayPauseButtonProps) => {
  const isThisTrackPlaying = useIsThisTrackPlaying(track.id);

  const playTrack = usePlayerStore((state) => state.playTrack);

  const handlePress = () => playTrack(track);

  return (
    <>{children({ isPlaying: isThisTrackPlaying, onPress: handlePress })}</>
  );
};

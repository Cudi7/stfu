// hooks/useIsThisTrackPlaying.ts

import { usePlayerStore } from "@/stores/usePlayerStore";

/**
 * A custom hook that returns a boolean indicating if the given track ID
 * is the one currently loaded AND playing.
 *
 * This component will ONLY re-render if its own playing status changes.
 */
export const useIsThisTrackPlaying = (trackId: string) => {
  const isPlaying = usePlayerStore(
    // This selector calculates the final boolean value.
    // Zustand will only trigger a re-render if the returned value (true/false) changes.
    (state) => state.track?.id === trackId && state.isPlaying,
  );
  return isPlaying;
};

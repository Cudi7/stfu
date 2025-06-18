import { AudioPlayer, AudioStatus, createAudioPlayer } from "expo-audio";
import { create } from "zustand";

export interface Track {
  id: string;
  username: string;
  title: string;
  duration: string;
  audioUrl: string;
  durationSeconds: number;
}

const PLAYBACK_SPEEDS = [1, 1.5, 2];

interface PlayerState {
  player: AudioPlayer;
  track: Track | null;
  isPlaying: boolean;
  isFinished: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  playbackPositions: Record<string, number>;
  initializeListener: () => void;
  playTrack: (newTrack: Track) => Promise<void>;
  closePlayer: () => void;
  seekForward: () => Promise<void>;
  seekBackward: () => Promise<void>;
  seekTo: (time: number) => Promise<void>;
  cyclePlaybackRate: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => {
  const player = createAudioPlayer();
  let hasInitializedListener = false;

  return {
    player,
    track: null,
    isPlaying: false,
    isFinished: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
    playbackPositions: {},

    initializeListener: () => {
      if (hasInitializedListener) return;
      hasInitializedListener = true;

      player.addListener("playbackStatusUpdate", (status: AudioStatus) => {
        const { isPlaying, isLoading, track, isFinished } = get();

        if (isLoading) {
          if (status.playing) {
            set({ isLoading: false });
          }
          return;
        }

        if (isPlaying !== status.playing) {
          set({ isPlaying: status.playing });
        }

        set({
          currentTime: status.currentTime ?? 0,
          duration: status.duration ?? 0,
        });

        if (status.didJustFinish && !isFinished) {
          set(() => ({
            isPlaying: false,
            isFinished: true,
            playbackPositions: track
              ? { ...get().playbackPositions, [track.id]: 0 }
              : get().playbackPositions,
          }));
        }
      });
    },

    playTrack: async (newTrack: Track) => {
      const {
        player,
        track,
        isPlaying,
        isFinished,
        currentTime,
        playbackPositions,
      } = get();

      if (track?.id === newTrack.id) {
        if (isFinished) {
          await player.seekTo(0);
          player.play();
          set({ isFinished: false, isPlaying: true });
        } else if (isPlaying) {
          player.pause();
          set((state) => ({
            playbackPositions: {
              ...state.playbackPositions,
              [track.id]: currentTime,
            },
          }));
        } else {
          player.play();
        }
      } else {
        const newPlaybackPositions = { ...playbackPositions };
        if (track && currentTime > 0) {
          newPlaybackPositions[track.id] = currentTime;
        }

        const savedPosition = newPlaybackPositions[newTrack.id] || 0;

        set({
          track: newTrack,
          isPlaying: true,
          isFinished: false,
          isLoading: true,
          currentTime: savedPosition,
          duration: newTrack.durationSeconds,
          playbackPositions: newPlaybackPositions,
        });

        try {
          await player.replace({ uri: newTrack.audioUrl });
          if (savedPosition > 0) {
            await player.seekTo(savedPosition);
          }
          player.play();
          const { playbackRate } = get();

          player.shouldCorrectPitch = true;
          player.setPlaybackRate(playbackRate);
        } catch (e) {
          console.error("Failed to load and play new track", e);
          set({ isPlaying: false, isLoading: false });
        }
      }
    },

    closePlayer: () => {
      const { player, track, currentTime } = get();
      if (track) {
        player.pause();
        set((state) => ({
          playbackPositions: {
            ...state.playbackPositions,
            [track.id]: currentTime,
          },
          track: null,
          isPlaying: false,
        }));
      }
    },

    seekForward: async () => {
      const { player, currentTime, duration } = get();
      const newTime = Math.min(duration, currentTime + 10);
      await player.seekTo(newTime);
      set({ currentTime: newTime });
    },

    seekBackward: async () => {
      const { player, currentTime } = get();
      const newTime = Math.max(0, currentTime - 10);
      await player.seekTo(newTime);
      set({ currentTime: newTime });
    },

    seekTo: async (time: number) => {
      const { player, duration } = get();
      const newTime = Math.max(0, Math.min(time, duration));
      if (player) {
        await player.seekTo(newTime);
        set({ currentTime: newTime });
      }
    },

    cyclePlaybackRate: () => {
      const { player, playbackRate } = get();
      const currentIndex = PLAYBACK_SPEEDS.indexOf(playbackRate);
      const nextIndex = (currentIndex + 1) % PLAYBACK_SPEEDS.length;
      const newRate = PLAYBACK_SPEEDS[nextIndex];

      if (player) {
        player.shouldCorrectPitch = true;
        player.setPlaybackRate(newRate);
      }
      set({ playbackRate: newRate });
    },
  };
});

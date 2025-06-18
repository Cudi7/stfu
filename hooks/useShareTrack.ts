import { Track } from "@/stores/usePlayerStore";
import { Alert, Platform, Share } from "react-native";

/**
 * A custom hook to provide track sharing functionality.
 * It uses the React Native Share API to share a deep link and a fallback web URL.
 *
 * @returns An object with a `shareTrack` function.
 */
export const useShareTrack = () => {
  const shareTrack = async (track: Track | null) => {
    if (!track) {
      Alert.alert("Nothing to Share", "There is no track currently selected.");
      return;
    }

    try {
      // The link that opens your app directly to the track
      const deepLink = `stfumobile://track/${track.id}`;

      // A fallback web URL for users who don't have the app installed
      const webUrl = `https://stfu-app.com/track/${track.id}`;

      const message =
        Platform.OS === "ios"
          ? `Listen to "${track.title}" by ${track.username} on STFU.`
          : `Listen to "${track.title}" by ${track.username} on STFU. \n\nListen here: ${deepLink}`;

      const result = await Share.share(
        {
          title: `STFU: ${track.title}`,
          message,
          url: webUrl,
        },
        {
          dialogTitle: `Share "${track.title}"`,
        },
      );

      if (result.action === Share.sharedAction) {
        console.log(
          "Track shared successfully. Activity Type:",
          result.activityType || "N/A",
        );
      } else if (result.action === Share.dismissedAction) {
        console.log("Share sheet was dismissed.");
      }
    } catch (error: any) {
      Alert.alert("Error", `Failed to share: ${error.message}`);
    }
  };

  return { shareTrack };
};

/**
 * Formats a given time in seconds into a string representation of minutes and seconds (MM:SS).
 *
 * @param timeInSeconds The time in seconds to format.
 * @returns A string in MM:SS format.
 */
export function formatTime(timeInSeconds: number): string {
  const safeTime = Math.floor(timeInSeconds) || 0;
  const minutes = Math.floor(safeTime / 60);
  const seconds = safeTime % 60;
  // Pads the seconds with a leading zero if it's less than 10
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

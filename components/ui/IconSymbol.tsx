// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
// type IconSymbolName = keyof typeof MAPPING; // This will now correctly include all keys

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "arrow.counterclockwise": "replay",

  magnifyingglass: "search",
  "mic.fill": "mic",
  "person.fill": "person",
  gearshape: "settings",
  "play.fill": "play-arrow",
  "stop.fill": "stop",
  trash: "delete",
  "square.and.pencil": "edit",
  tag: "local-offer", // Material 'local_offer' for tag
  waveform: "graphic-eq",
  ellipsis: "more-horiz",
  "square.and.arrow.up": "share",
  grid: "apps",
  heart: "favorite-border", // SF 'heart' is an outline
  bookmark: "bookmark-border", // SF 'bookmark' is an outline
  "pause.fill": "pause",
  message: "chat-bubble-outline", // SF 'message' is an outline
  paperplane: "send", // for outline or general use, maps to same as paperplane.fill
  bell: "notifications-none", // SF 'bell' is an outline

  "chevron.down": "keyboard-arrow-down",
  shuffle: "shuffle",
  repeat: "repeat",
  "backward.10": "replay-10",
  "forward.10": "forward-10",
  "music.note": "music-note",

  "heart.fill": "favorite",
  "bookmark.fill": "bookmark",
  // 'bell.fill': 'notifications',
  // 'message.fill': 'chat-bubble',
} as IconMapping;

// Define the type for allowed names based on the MAPPING keys
export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight; // SF Symbol specific, Material Icons doesn't use this directly
}) {
  const materialIconName = MAPPING[name];
  if (!materialIconName) {
    console.warn(
      `IconSymbol: No Material Icon mapping found for SF Symbol "${name}". Falling back to 'help' icon.`,
    );
    return (
      <MaterialIcons
        color={color}
        size={size}
        name="help-outline"
        style={style}
      />
    ); // Fallback icon
  }
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={materialIconName}
      style={style}
    />
  );
}

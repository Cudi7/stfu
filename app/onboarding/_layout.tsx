import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back during onboarding
        animation: "fade",
      }}
    >
      <Stack.Screen name="splash" options={{ gestureEnabled: false }} />
      <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
      <Stack.Screen name="signup" options={{ gestureEnabled: false }} />
    </Stack>
  );
}

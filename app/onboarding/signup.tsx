"use client";

import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State to toggle between Sign Up and Log In views on this screen
  const [isLoginView, setIsLoginView] = useState(false);

  // Animation shared values
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-30);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    headerTranslateY.value = withTiming(0, { duration: 600 });
    buttonsOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    buttonsTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
    footerOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  async function handleEmailSignUp() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Sign Up Error", error.message);
    } else if (!session) {
      Alert.alert(
        "Check your email!",
        "Please check your inbox for email verification to complete sign up.",
      );
    }
    setLoading(false);
  }

  async function handleEmailLogin() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Login Error", error.message);
    }
    setLoading(false);
  }

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <StatusBar style="dark" />
      <View
        className="absolute top-12 right-6 z-10"
        style={{ paddingTop: insets.top + 10, paddingRight: 10 }}
      >
        <TouchableOpacity className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
          <Ionicons name="help-outline" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Important for inputs in ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <Animated.View
          style={headerAnimatedStyle}
          className="px-8 pt-10 pb-6 md:pt-16 md:pb-8"
        >
          <Text className="text-black text-3xl font-bold text-center mb-2">
            {isLoginView ? "Welcome Back!" : "Create your Account"}
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6">
            {isLoginView
              ? "Log in to continue your audio journey."
              : "Sign up to start sharing and listening."}
          </Text>
        </Animated.View>

        {/* Email/Password Form */}
        <Animated.View style={buttonsAnimatedStyle} className="px-8 space-y-4">
          <View className="space-y-3">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">
                Email address
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg py-3 px-4 text-base bg-white"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">
                Password
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg py-3 px-4 text-base bg-white"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={isLoginView ? handleEmailLogin : handleEmailSignUp}
            className="flex-row items-center justify-center bg-red-500 rounded-lg py-4 px-6 mt-4" // Using a primary color
            activeOpacity={0.7}
            disabled={loading}
          >
            <Text className="text-center text-white text-lg font-medium">
              {loading
                ? "Processing..."
                : isLoginView
                ? "Log In"
                : "Create Account"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert("Info", "Google Sign-In coming soon!")}
            className="flex-row items-center bg-white border border-gray-300 rounded-lg py-4 px-6"
            activeOpacity={0.7}
            disabled={loading}
          >
            <View className="w-6 h-6 bg-red-500 rounded-full items-center justify-center mr-3">
              <Text className="text-white text-xs font-bold">G</Text>
            </View>
            <Text className="flex-1 text-center text-black text-lg font-medium">
              Continue with Google
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <View className="flex-row justify-center items-center mt-8">
          <Text className="text-black text-base">
            {isLoginView
              ? "Don't have an account? "
              : "Already have an account? "}
          </Text>
          <TouchableOpacity
            onPress={() => setIsLoginView(!isLoginView)}
            disabled={loading}
          >
            <Text className="text-red-500 text-base font-medium">
              {isLoginView ? "Sign Up" : "Log In"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-grow" />

        <Animated.View
          style={footerAnimatedStyle}
          className="px-8 pb-8 mt-auto pt-6"
        >
          <Text className="text-gray-500 text-center text-sm leading-5 mb-6">
            By continuing, you agree to our{" "}
            <Text className="text-black font-medium">Terms of Service</Text> and
            {"\n"}
            acknowledge that you have read our{" "}
            <Text className="text-black font-medium">Privacy Policy</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

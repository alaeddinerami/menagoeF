import { View, Text, Image } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient"; 
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { useEffect } from "react";
import CustomButton from "~/components/CustomButton";

export default function IndexScreen() {
    const router = useRouter();
  return (
    <LinearGradient
      colors={["#ffffff", "#e6f0fa"]} // White to light blue gradient
      className="flex-1 justify-between p-6"
    >
      <StatusBar style="dark" />

      <View className="items-center mt-20">
        {/* Uncomment if you have an image */}
        {/* <Image source={cleaningImage} className="w-40 h-40 mb-6" /> */}
        <Text className="text-4xl font-bold text-blue-700 text-center">
          Sparkle Clean
        </Text>
        <Text className="text-lg text-gray-600 text-center mt-2">
          Your trusted cleaning service
        </Text>
      </View>

      <View className="mb-10">
        <CustomButton
          title="Login"
          onPress={() => router.push("/(auth)/login")}
          style="bg-blue-600 mb-4"
        />
        <CustomButton
          title="Sign Up"
          onPress={() => router.push("/(auth)/register")}
          style="bg-green-500"
        />
      </View>

      <Text className="text-center text-gray-500 text-sm">
        Making your home sparkle, one clean at a time
      </Text>
    </LinearGradient>
  );
}
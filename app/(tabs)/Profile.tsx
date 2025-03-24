import { Stack, useRouter } from "expo-router";
import {  useRef, useState } from "react";
import { View, StatusBar, Animated, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "~/redux/store";
import { logout } from "~/redux/slices/authSlice";
import ProfileHeader from "~/components/profile/ProfileHeader";
import TabNavigation from "~/components/profile/TabNavigation";
import ReservationsSection from "~/components/profile/ReservationsSection";
import ProfileSection from "~/components/profile/ProfileSection";


export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [activeTab, setActiveTab] = useState<"reservations" | "personal">("reservations");

  const handleLogout = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(logout());
      router.push("/(auth)/wapperAuth");
    });
  };

  return (
    <Animated.View className="flex-1 bg-gray-50" style={{ opacity: fadeAnim }}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          title: "My Profile",
          headerStyle: { backgroundColor: "#6366F1" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <ProfileHeader user={user} />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === "reservations" ? (
          <ReservationsSection />
        ) : (
          <ProfileSection user={user} />
        )}
        <View className="px-4 mb-10">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white border border-red-500 w-full py-4 rounded-xl flex-row justify-center items-center"
          >
            <Text className="text-red-500 font-medium ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </Animated.View>
  );
}
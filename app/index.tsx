import { View, Text, Image } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient"; 
import CustomButton from "../components/CustomButton";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { useEffect } from "react";

export default function IndexScreen() {
  const router = useRouter();
  const { loading, user, isAuthenticated } = useSelector((state: RootState) => state.auth);
const userRole = user?.user?.roles[0] || 'client';
  // console.log(user)
  // console.log(userRole)

  if(loading) {
    return null
  }

  if (isAuthenticated) {
    if (userRole === "cleaner") {
      return <Redirect href="/(cleaners)" />;
    } else if (userRole === "client") {
      return <Redirect href="/(tabs)" />;
    } else {
      console.log("Unknown role, defaulting to (tabs)");
      return <Redirect href="/(tabs)" />;
    }
  }

  return <Redirect href="/(auth)/wapperAuth" />;
}
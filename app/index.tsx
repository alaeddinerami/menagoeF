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
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);


  if(loading) {
    return null
  }

  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/wapperAuth" />;

}
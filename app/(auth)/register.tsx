import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Stack, useRouter } from "expo-router";
import { signup } from "~/redux/slices/authSlice";
import { AppDispatch, RootState } from "~/redux/store";
import InputField from "~/components/InputField";
import * as ImagePicker from "expo-image-picker"; // For image selection

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null); 
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    formData.append("location", location);
    if (image) {
      const imageFile = {
        uri: image,
        name: `profile-${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any; 
      formData.append("image", imageFile);
    }

    dispatch(signup(formData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        router.push("/(tabs)");
      }
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-gradient-to-b from-indigo-50 to-white px-8 py-12">
        <Animated.View className="flex-1 justify-center" style={{ opacity: fadeAnim }}>
          <Text className="text-4xl font-extrabold text-indigo-800 text-center mb-12 tracking-tight">
            Create Account
          </Text>

          <View className="space-y-5">
            <InputField
              placeholder="Name"
              value={name}
              onChangeText={setName}
              className="bg-white border border-indigo-300 rounded-2xl px-5 py-4 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              autoCapitalize="words"
            />
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className="bg-white border border-indigo-300 rounded-2xl px-5 py-4 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-white border border-indigo-300 rounded-2xl px-5 py-4 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <InputField
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              className="bg-white border border-indigo-300 rounded-2xl px-5 py-4 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <InputField
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
              className="bg-white border border-indigo-300 rounded-2xl px-5 py-4 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              keyboardType="phone-pad"
            />
            <InputField
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
              className="bg-white border border-indigo-300 rounded-2xl px-5 py-4 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <TouchableOpacity
              onPress={pickImage}
              className="bg-white border border-indigo-300 rounded-2xl px-5 py-4 shadow-sm"
            >
              <Text className="text-indigo-600 text-lg">
                {image ? "Change Image" : "Upload Image"}
              </Text>
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                className="w-32 h-32 rounded-xl self-center mt-2"
              />
            )}
          </View>

          {error && (
            <Text className="text-red-600 text-center mt-4 text-base font-medium animate-pulse">
              {error}
            </Text>
          )}

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={handleSignup}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading}
              className={`mt-10 py-4 px-6 rounded-2xl shadow-lg ${
                loading ? "bg-indigo-400" : "bg-indigo-600"
              }`}
              accessibilityRole="button"
              accessibilityLabel={loading ? "Signing up" : "Sign Up"}
            >
              <Text className="text-white text-center text-xl font-bold tracking-wide">
                {loading ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-8"
            accessibilityRole="link"
            accessibilityLabel="Login"
          >
            <Text className="text-center text-gray-700 text-lg">
              Already have an account?{" "}
              <Text className="text-indigo-600 font-bold underline">Login</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}
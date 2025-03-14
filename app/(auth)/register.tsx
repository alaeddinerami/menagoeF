import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/slices/authSlice";
import InputField from "../../components/InputField";
import CustomButton from "../../components/CustomButton";
import { Link, useRouter } from "expo-router";
import { RootState, AppDispatch } from "../../redux/store";

export default function RegisterScreen() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    dispatch(signup({name, email, password })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        router.push("/(tabs)");
      }
    });
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Create Account
      </Text>

      <InputField placeholder="Name" value={name} onChangeText={setName} />
      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <InputField
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}
      <CustomButton
        title={loading ? "Signing Up..." : "Sign Up"}
        onPress={handleSignup}
        style={loading ? "bg-blue-400" : "bg-blue-600"}
        disabled={loading}
      />

      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}>
          <Text className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Text className="text-blue-600 font-semibold">Login</Text>
          </Text>
      </TouchableOpacity>
    </View>
  );
}
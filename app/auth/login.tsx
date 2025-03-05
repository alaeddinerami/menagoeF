import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useRouter } from "expo-router";
import { AppDispatch, RootState } from "~/redux/store";
import { login } from "~/redux/slices/authSlice";
import InputField from "~/components/InputField";
import CustomButton from "~/components/CustomButton";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleLogin = () => {
    dispatch(login({ email, password })).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        // router.push("/home"); // Uncomment when home screen is added
      }
    });
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Welcome Back
      </Text>

      <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}
      <CustomButton
        title={loading ? "Logging In..." : "Login"}
        onPress={handleLogin}
        style={loading ? "bg-blue-400" : "bg-blue-600"}
        disabled={loading}
      />

      <TouchableOpacity>
          <Text className="text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Text className="text-blue-600 font-semibold">Sign Up</Text>
          </Text>
      </TouchableOpacity>
    </View>
  );
}
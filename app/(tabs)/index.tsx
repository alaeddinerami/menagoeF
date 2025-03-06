import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { AppDispatch, RootState } from "~/redux/store";
import { logout } from "~/redux/slices/authSlice";
import CustomButton from "~/components/CustomButton";

export default function HomeScreen() {
  const { user ,isAuthenticated} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
// console.log(isAuthenticated);
  const handleLogout = () => {
    dispatch(logout());
    console.log('log');
    router.push("/(auth)/wapperAuth");
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      <Text className="text-2xl font-bold text-blue-700 mb-4">
        Welcome to Sparkle Clean!
      </Text>
      <Text className="text-lg text-gray-600 mb-6">
        Hello, {user?.email }!
      </Text>
      <CustomButton
        title="Logout"
        onPress={handleLogout}
        style="bg-red-500"
      />
    </View>
  );
}
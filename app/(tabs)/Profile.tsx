import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '~/components/CustomButton';

import { ScreenContent } from '~/components/ScreenContent';
import { logout } from '~/redux/slices/authSlice';
import { AppDispatch, RootState } from '~/redux/store';


export default function Profile() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  console.log(user);
  const handleLogout = () => {
    dispatch(logout());
    console.log('log');
    router.push('/(auth)/wapperAuth');
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="mb-4 text-2xl font-bold text-blue-700">Welcome to Sparkle Clean!</Text>
      <Text className="mb-6 text-lg text-gray-600">Hello, {user?.user?.email}!</Text>
      <CustomButton title="Logout" onPress={handleLogout} style="bg-red-500" />
    </View>
  );
}

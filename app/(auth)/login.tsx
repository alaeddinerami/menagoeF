import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Stack, useRouter } from 'expo-router';
import { AppDispatch, RootState } from '~/redux/store';
import { login } from '~/redux/slices/authSlice';
import InputField from '~/components/InputField';
import CustomButton from '~/components/CustomButton';
enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  CLEANER = 'cleaner',
}
export default function LoginScreen() {
  const [email, setEmail] = useState<string>('cleaner@gmail.com');
  const [password, setPassword] = useState<string>('12345678');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      
      // Safely handle roles with fallback
      const userRoles = result.user.roles || [];
      const primaryRole = userRoles.length > 0 ? userRoles[0].toLowerCase() : null;

      console.log('user roles:', userRoles);

      if ( primaryRole) {
        switch (primaryRole) {
          case UserRole.CLIENT:
            router.replace("/(tabs)");
            break;
          // case UserRole.ADMIN:
          //   router.replace("/(tabs)/admin-dashboard");
          //   break;
          case UserRole.CLEANER:
            console.log('ana ghadi l chat');
            router.replace('/(cleaners)');
            break;
          default:     
           console.log(`Unknown role: ${primaryRole}`);
            router.replace("/(tabs)"); 
            break;
        }
      } else {
        // Fallback if no roles or not authenticated
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log('Login error:', error);
    }
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 justify-center bg-white p-6">
        <Text className="mb-8 text-center text-3xl font-bold text-blue-700">Welcome Back</Text>

        <InputField placeholder="Email" value={email} onChangeText={setEmail} />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}
        <CustomButton
          title={loading ? 'Logging In...' : 'Login'}
          onPress={handleLogin}
          style={loading ? 'bg-blue-400' : 'bg-blue-600'}
          disabled={loading}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text className="mt-4 text-center text-gray-600">
            Don’t have an account? <Text className="font-semibold text-blue-600">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

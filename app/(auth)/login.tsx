import React, { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Link, Stack, useRouter } from "expo-router"
import { AppDispatch, RootState } from "~/redux/store"
import { login } from "~/redux/slices/authSlice"
import InputField from "~/components/InputField"

enum UserRole {
  CLIENT = "client",
  ADMIN = "admin",
  CLEANER = "cleaner",
}

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, user } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const result = await dispatch(login({ email, password })).unwrap()
      const userRoles = result.user.roles || []
      const primaryRole = userRoles.length > 0 ? userRoles[0].toLowerCase() : null

      console.log("user roles:", userRoles)

      if (primaryRole) {
        switch (primaryRole) {
          case UserRole.CLIENT:
            router.replace("/(tabs)")
            break
          case UserRole.CLEANER:
            console.log("ana ghadi l chat")
            router.replace("/(cleaners)")
            break
          case UserRole.ADMIN:
            console.log("ana ghadi l admin")
            router.replace("/(admin)")
            break
          default:
            console.log(`Unknown role: ${primaryRole}`)
            router.replace("/(tabs)")
            break
        }
      } else {
        router.replace("/(tabs)")
      }
    } catch (error) {
      console.log("Login error:", error)
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-gray-50 px-6 py-12 justify-center">
        <Text className="text-4xl font-extrabold text-indigo-700 text-center mb-10 tracking-tight">
          Welcome Back
        </Text>

        <View className="space-y-6">
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="bg-white border border-indigo-200 rounded-xl px-4 py-3 text-base"
          />
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="bg-white border border-indigo-200 rounded-xl px-4 py-3 text-base"
          />
        </View>

        {error && (
          <Text className="text-red-500 text-center mt-4 text-sm font-medium">
            {error}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className={`mt-8 py-4 rounded-xl shadow-md ${
            loading ? "bg-indigo-400" : "bg-indigo-600"
          }`}
          activeOpacity={0.9}
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Logging In..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          className="mt-6"
        >
          <Text className="text-center text-gray-600 text-base">
            Don’t have an account?{" "}
            <Text className="text-indigo-600 font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
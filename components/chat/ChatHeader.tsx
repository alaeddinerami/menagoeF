import { View, Text, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

export default function ChatHeader() {
  const router = useRouter()

  return (
    <View className="flex-row items-center bg-indigo-500 px-4 py-2 h-[60px]">
      <TouchableOpacity className="mr-2.5" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View className="flex-1 flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-gray-300 mr-2.5 overflow-hidden">
          <Image 
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} 
            className="w-10 h-10 rounded-full"
          />
        </View>
        <View>
          <Text className="text-white text-base font-bold">John Doe</Text>
          <Text className="text-indigo-200 text-xs">Online</Text>
        </View>
      </View>
      <TouchableOpacity className="ml-4">
        <Ionicons name="ellipsis-vertical" size={22} color="white" />
      </TouchableOpacity>
    </View>
  )
}
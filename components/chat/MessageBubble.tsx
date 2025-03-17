import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "react-native"

interface MessageBubbleProps {
  isSent: boolean
  text: string
  time: string
  readStatus?: "sent" | "read"
}

export default function MessageBubble({
  isSent,
  text,
  time,
  readStatus
}: MessageBubbleProps) {
  const colorScheme = useColorScheme()

  return (
    <View className={`mb-2 max-w-[80%] ${isSent ? 'self-end' : 'self-start'}`}>
      <View className={`rounded-lg p-2.5 min-w-[80px] ${
        isSent 
          ? `${colorScheme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-tr-none`
          : `${colorScheme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-tl-none`
      }`}>
        <Text className={`text-base ${
          colorScheme === 'dark' ? 'text-white' : 'text-black'
        }`}>
          {text}
        </Text>
        <View className="flex-row justify-end items-center mt-1">
          <Text className={`text-[11px] ${
            colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-500'
          } mr-1`}>
            {time}
          </Text>
          {isSent && readStatus && (
            <Ionicons 
              name={readStatus === 'read' ? "checkmark-done" : "checkmark"} 
              size={16} 
              color={readStatus === 'read' ? "#6366F1" : "#8696a0"}
            />
          )}
        </View>
      </View>
    </View>
  )
}
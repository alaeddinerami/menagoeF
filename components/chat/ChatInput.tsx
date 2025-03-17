import { View, TextInput, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useColorScheme } from "react-native"

interface ChatInputProps {
  message: string
  setMessage: (text: string) => void
  onSend: () => void
}

export default function ChatInput({
  message,
  setMessage,
  onSend
}: ChatInputProps) {
  const colorScheme = useColorScheme()

  return (
    <View className={`flex-row items-center p-2 ${
      colorScheme === 'dark' ? 'bg-gray-800' : 'bg-indigo-100'
    }`}>
      <View className={`flex-1 flex-row items-center ${
        colorScheme === 'dark' ? 'bg-gray-700' : 'bg-white'
      } rounded-3xl px-3 mr-2`}>
        <TouchableOpacity 
          className="mx-1 p-1"
          accessibilityLabel="Select emoji"
        >
          <Ionicons 
            name="happy-outline" 
            size={24} 
            color={colorScheme === 'dark' ? '#d1d5db' : '#8696a0'} 
          />
        </TouchableOpacity>
        <TextInput
          className={`flex-1 text-base py-2 max-h-[100px] ${
            colorScheme === 'dark' ? 'text-white' : 'text-black'
          }`}
          placeholder="Message"
          placeholderTextColor={colorScheme === 'dark' ? '#9ca3af' : '#8696a0'}
          multiline
          value={message}
          onChangeText={setMessage}
          accessibilityLabel="Message input"
        />
      </View>
      <TouchableOpacity 
        className="bg-indigo-500 w-12 h-12 rounded-full justify-center items-center"
        onPress={onSend}
        accessibilityLabel="Send message"
      >
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}
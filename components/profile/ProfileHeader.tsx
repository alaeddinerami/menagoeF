import { View, Image, TouchableOpacity, Text, Alert } from "react-native";
import { Camera } from "lucide-react-native";

interface ProfileHeaderProps {
  user: any; 
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const imageUrl = "https://avatar.iran.liara.run/public";
  const name = user?.user?.name || "cleaner";
  const email = user?.user?.email || "cleaner@gmail.com";

  const handleImageUpdate = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: () => console.log("Take Photo pressed") },
      { text: "Choose from Gallery", onPress: () => console.log("Choose from Gallery pressed") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <View className="bg-indigo-500 pt-6 pb-8 items-center">
      <View className="relative">
        <View className="rounded-full border-4 border-white shadow-lg">
          <Image source={{ uri: imageUrl }} className="w-24 h-24 rounded-full" />
        </View>
        <TouchableOpacity
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"
          onPress={handleImageUpdate}
        >
          <Camera size={18} color="#6366F1" />
        </TouchableOpacity>
      </View>
      <Text className="text-white text-xl font-bold mt-3">{name}</Text>
      <Text className="text-blue-100 opacity-80">{email}</Text>
    </View>
  );
}
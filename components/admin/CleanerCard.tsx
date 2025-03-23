import { Image, Text, TouchableOpacity, View } from "react-native";

interface Cleaner {
  _id: string;
  name: string;
  location: string;
  phone: string;
  image?: string; 
}

export const CleanerCard = ({ cleaner }: { cleaner: Cleaner }) => {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const cleanerImage = cleaner.image
    ? `${BASE_URL}/${cleaner.image}`
    : "https://avatar.iran.liara.run/public"; 

//   console.log('clenar image:', cleanerImage);

  return (
    <TouchableOpacity className="bg-white rounded-2xl p-4 mb-4 shadow-md mx-4">
      <View className="flex-row items-center space-x-4 gap-4">
        <Image
          source={{ uri: cleanerImage }}
          className="w-16 h-16 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{cleaner.name}</Text>
          <Text className="text-sm text-gray-600">{cleaner.location}</Text>
          <Text className="text-sm text-gray-500">{cleaner.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
import { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { updateCleaner } from '~/redux/slices/cleanersSlice';
import { RootState, AppDispatch } from '~/redux/store';

interface Cleaner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  image?: string | null;
  roles: string[];
}

interface ProfileHeaderProps {
  user: { user: any };
}

export default function ProfileHeader({ user: initialUser }: ProfileHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { cleaners, loading } = useSelector((state: RootState) => state.cleaners);
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL 

  const cleaner = cleaners.find((c) => c._id === initialUser.user._id) || initialUser.user;
  const [imageUri, setImageUri] = useState<string>(
    cleaner.image ? `${BASE_URL}/${cleaner.image}` : 'https://avatar.iran.liara.run/public'
  );
useEffect(() => {
  console.log('cleaner:', cleaners);
  
}, [cleaner, BASE_URL]);
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Please allow gallery access to update your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      console.log('User cancelled image picker');
      return;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert('Error', 'No image selected');
      return;
    }

    const formData = new FormData();
    const fileExtension = asset.uri.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeType = `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`;
    const fileName = asset.fileName || `profile-${Date.now()}.${fileExtension}`;

    formData.append('image', {
      uri: asset.uri,
      type: mimeType, // Use specific MIME type
      name: fileName,
    } as any);

    // Log FormData for debugging
    const formDataEntries: [string, any][] = [];
    formData.forEach((value, key) => formDataEntries.push([key, value]));
    console.log('FormData being sent:', JSON.stringify(formDataEntries));

    try {
      await dispatch(updateCleaner({ id: cleaner._id, formData })).unwrap();
      setImageUri(asset.uri);
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to update profile picture';
      Alert.alert('Error', errorMessage);
      console.error('Image update error:', errorMessage, error);
    }
  };

  return (
    <View className="bg-indigo-500 pt-6 pb-8 items-center">
      <View className="relative">
        <View className="rounded-full border-4 border-white shadow-lg">
          <Image
            source={{ uri: imageUri }}
            className="w-24 h-24 rounded-full"
            resizeMode="cover"
          />
          {loading && (
            <View className="absolute inset-0 bg-gray-900/50 rounded-full justify-center items-center">
              <ActivityIndicator size="small" color="#fff" />
            </View>
          )}
        </View>
        <TouchableOpacity
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"
          onPress={pickImage}
          disabled={loading}
        >
          <Camera size={18} color={loading ? '#ccc' : '#6366F1'} />
        </TouchableOpacity>
      </View>
      <Text className="text-white text-xl font-bold mt-3">{cleaner.name || 'cleaner'}</Text>
      <Text className="text-blue-100 opacity-80">{cleaner.email || 'cleaner@gmail.com'}</Text>
    </View>
  );
}
import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { User, Mail, Phone, MapPin } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '~/redux/store';
import { updateCleaner } from '~/redux/slices/cleanersSlice';

interface Cleaner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  image?: string | null;
  roles: string[];
}

interface ProfileSectionProps {
  user: {
    user: Cleaner;
  };
}

export default function ProfileSection({ user: initialUser }: ProfileSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners);

  const cleaner = cleaners.find((c) => c._id === initialUser.user._id) || initialUser.user;

  const [phone, setPhone] = useState(cleaner.phone || '0631713593');
  const [location, setLocation] = useState(cleaner.location || 'agadire');
  const [isEditing, setIsEditing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setPhone(cleaner.phone || '0631713593');
    setLocation(cleaner.location || 'agadir');
  }, [cleaner]);

  const toggleEditMode = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('location', location);

    try {
      await dispatch(updateCleaner({ id: cleaner._id, formData })).unwrap();
      Animated.timing(slideAnim, {
        toValue: 10,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(slideAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
      });
      setIsEditing(false);
      Alert.alert('Success', 'Phone and location updated successfully!');
    } catch (err) {
      Alert.alert('Error', error || 'Failed to update phone and location');
    }
  };

  const renderField = (
    label: string,
    value: string,
    icon: JSX.Element,
    setter?: (value: string) => void, 
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
    multiline = false
  ) => (
    <Animated.View
      className="p-4 border-b border-gray-100"
      style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}
    >
      <View className="flex-row items-center mb-1">
        {icon}
        <Text className="text-gray-500 text-xs ml-2">{label}</Text>
      </View>
      {setter && isEditing ? (
        <TextInput
          value={value}
          onChangeText={setter}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 2 : 1}
          className="text-gray-800 font-medium border-b border-gray-200 py-2 pl-7 mt-1"
        />
      ) : (
        <Text className="text-gray-800 font-medium pl-7 py-2">{value}</Text>
      )}
    </Animated.View>
  );

  return (
    <View className="p-4">
      <View className="flex-row justify-between items-center mb-4 px-2">
        <Text className="text-lg font-bold text-gray-800">Personal Information</Text>
        <TouchableOpacity
          onPress={isEditing ? handleSaveProfile : toggleEditMode}
          className={`py-1 px-3 rounded-full ${
            isEditing ? 'bg-green-500' : 'bg-blue-500'
          } ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          <Text className="text-white font-medium">
            {loading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
        {renderField('Full Name', cleaner.name, <User size={16} color="#6366F1" />)}
        {renderField('Email Address', cleaner.email, <Mail size={16} color="#6366F1" />, undefined, 'email-address')}
        {renderField('Phone Number', phone, <Phone size={16} color="#6366F1" />, setPhone, 'phone-pad')}
        {renderField('Location', location, <MapPin size={16} color="#6366F1" />, setLocation, 'default', true)}
      </View>
    </View>
  );
}
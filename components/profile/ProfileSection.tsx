import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, Alert } from "react-native";
import { User, Mail, Phone, MapPin } from "lucide-react-native";

interface ProfileSectionProps {
  user: any; 
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const [name, setName] = useState(user?.user?.name || "cleaner");
  const [email, setEmail] = useState(user?.user?.email || "cleaner@gmail.com");
  const [phone, setPhone] = useState(user?.user?.phone || "063171835");
  const [address, setAddress] = useState(user?.user?.location || "safi");
  const [isEditing, setIsEditing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleEditMode = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    Animated.timing(slideAnim, {
      toValue: 10,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(slideAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    });
    console.log("Saving profile:", { name, email, phone, address });
    setIsEditing(false);
    Alert.alert("Success", "Your profile has been updated successfully!");
  };

  const renderField = (
    label: string,
    value: string,
    setter: (value: string) => void,
    icon: JSX.Element,
    keyboardType: "default" | "email-address" | "phone-pad" = "default",
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
      {isEditing ? (
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
          className={`py-1 px-3 rounded-full ${isEditing ? "bg-green-500" : "bg-blue-500"}`}
        >
          <Text className="text-white font-medium">{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>
      <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
        {renderField("Full Name", name, setName, <User size={16} color="#6366F1" />)}
        {renderField("Email Address", email, setEmail, <Mail size={16} color="#6366F1" />, "email-address")}
        {renderField("Phone Number", phone, setPhone, <Phone size={16} color="#6366F1" />, "phone-pad")}
        {renderField("Location", address, setAddress, <MapPin size={16} color="#6366F1" />, "default", true)}
      </View>
    </View>
  );
}
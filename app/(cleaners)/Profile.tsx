import { Stack, useRouter } from "expo-router"
import { useState, useRef } from "react"
import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  StatusBar, 
  TextInput,
  ScrollView 
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import CustomButton from "~/components/CustomButton"
import { logout } from "~/redux/slices/authSlice"
import type { AppDispatch, RootState } from "~/redux/store"
import { Camera, Edit2, LogOut, MapPin, Mail, Phone, User, ChevronRight } from "lucide-react-native"

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  
  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  const [name, setName] = useState(user?.user?.name || "cleaner")
  const [email, setEmail] = useState(user?.user?.email || "cleaner@gmail.com")
  const [phone, setPhone] = useState(user?.user?.phone || "063171835")
  const [address, setAddress] = useState(user?.user?.location || "safi")
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      dispatch(logout())
      router.push("/(auth)/wapperAuth")
    })
  }

  const handleImageUpdate = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: () => console.log("Take Photo pressed") },
      { text: "Choose from Gallery", onPress: () => console.log("Choose from Gallery pressed") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const toggleEditMode = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start()
    
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = () => {
    Animated.timing(slideAnim, {
      toValue: 10,
      duration: 150,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      }).start()
    })
    
    console.log("Saving profile:", { name, email, phone, address })
    setIsEditing(false)
    Alert.alert("Success", "Your profile has been updated successfully!")
  }

  const imageUrl = "https://avatar.iran.liara.run/public"

  const renderField = (label, value, setter, icon, keyboardType = "default", multiline = false) => {
    return (
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
    )
  }

  return (
    <Animated.View className="flex-1 bg-gray-50" style={{ opacity: fadeAnim }}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          title: "My Profile",
          headerStyle: {
            backgroundColor: "#6366F1",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <View className="bg-indigo-500 pt-6 pb-8 items-center">
        <View className="relative">
          <View className="rounded-full border-4 border-white shadow-lg">
            <Image
              source={{ uri: imageUrl }}
              className="w-28 h-28 rounded-full"
            />
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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4 px-2">
            <Text className="text-lg font-bold text-gray-800">Personal Information</Text>
            <TouchableOpacity 
              onPress={isEditing ? handleSaveProfile : toggleEditMode}
              className={`py-1 px-3 rounded-full ${isEditing ? 'bg-green-500' : 'bg-blue-500'}`}
            >
              <Text className="text-white font-medium">
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            {renderField("Full Name", name, setName, <User size={16} color="#6366F1" />)}
            {renderField("Email Address", email, setEmail, <Mail size={16} color="#6366F1" />, "email-address")}
            {renderField("Phone Number", phone, setPhone, <Phone size={16} color="#6366F1" />, "phone-pad")}
            {renderField("Location", address, setAddress, <MapPin size={16} color="#6366F1" />, "default", true)}
          </View>

          <View className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
            <TouchableOpacity className="p-4 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                  <User size={16} color="#8b5cf6" />
                </View>
                <Text className="ml-3 text-gray-800 font-medium">Account Settings</Text>
              </View>
              <ChevronRight size={18} color="#6366F1" />
            </TouchableOpacity>
            
            <View className="h-px bg-gray-100" />
            
            <TouchableOpacity className="p-4 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                  <Edit2 size={16} color="#6366F1" />
                </View>
                <Text className="ml-3 text-gray-800 font-medium">Privacy & Security</Text>
              </View>
              <ChevronRight size={18} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mb-10">
          <TouchableOpacity 
            onPress={handleLogout}
            className="bg-white border border-red-500 w-full py-4 rounded-xl flex-row justify-center items-center"
          >
            <LogOut size={18} color="#ef4444" />
            <Text className="text-red-500 font-medium ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  )
}
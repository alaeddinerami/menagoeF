"use client"

import { Stack, useRouter } from "expo-router"
import { useState } from "react"
import { Text, View, Image, TouchableOpacity, Alert, Animated, StatusBar, TextInput } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import CustomButton from "~/components/CustomButton"
import { logout } from "~/redux/slices/authSlice"
import type { AppDispatch, RootState } from "~/redux/store"

export default function Profile() {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("reservations")

  // Personal info state
  const [name, setName] = useState(user?.user?.name || "Alex Johnson")
  const [email, setEmail] = useState(user?.user?.email || "alex.johnson@example.com")
  const [phone, setPhone] = useState("+1 (555) 123-4567")
  const [address, setAddress] = useState("123 Main St, Apt 4B, New York, NY 10001")
  const [isEditing, setIsEditing] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/(auth)/wapperAuth")
  }

  const handleImageUpdate = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: () => console.log("Take Photo pressed") },
      { text: "Choose from Gallery", onPress: () => console.log("Choose from Gallery pressed") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleSaveProfile = () => {
    console.log("Saving profile:", { name, email, phone, address })
    setIsEditing(false)
    Alert.alert("Success", "Your profile has been updated successfully!")
  }

  // Mock reservations data
  const reservations = [
    {
      id: "1",
      service: "Premium House Cleaning",
      date: "May 15, 2023",
      time: "10:00 AM - 12:00 PM",
      status: "Upcoming",
      address: "123 Main St, Apt 4B",
      price: "$85.00",
      cleaner: "Maria Johnson",
    },
    {
      id: "2",
      service: "Deep Cleaning",
      date: "April 28, 2023",
      time: "1:00 PM - 4:00 PM",
      status: "Completed",
      address: "123 Main St, Apt 4B",
      price: "$150.00",
      cleaner: "Robert Smith",
    },
    {
      id: "3",
      service: "Window Cleaning",
      date: "March 15, 2023",
      time: "9:00 AM - 11:00 AM",
      status: "Completed",
      address: "123 Main St, Apt 4B",
      price: "$65.00",
      cleaner: "Jennifer Davis",
    },
  ]

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          title: "My Profile",
          headerStyle: {
            backgroundColor: "#3b82f6",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      {/* Profile Header */}
      <View className="bg-blue-500 pt-4 pb-6 items-center">
        <View className="relative">
          <View className="rounded-full border-4 border-white shadow-md">
            <Image
              source={{ uri: "https://placeholder.svg?height=120&width=120" }}
              className="w-24 h-24 rounded-full"
            />
          </View>
          <TouchableOpacity
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"
            onPress={handleImageUpdate}
          >
            <Text>📷</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-white text-xl font-bold mt-2">{name}</Text>
        <Text className="text-blue-100">{email}</Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          className={`flex-1 py-4 items-center ${activeTab === "reservations" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("reservations")}
        >
          <Text className={`font-medium ${activeTab === "reservations" ? "text-blue-500" : "text-gray-500"}`}>
            My Reservations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-4 items-center ${activeTab === "personal" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("personal")}
        >
          <Text className={`font-medium ${activeTab === "personal" ? "text-blue-500" : "text-gray-500"}`}>
            My Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {activeTab === "reservations" ? (
          <View className="p-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">Your Cleaning Services</Text>

            {reservations.map((reservation) => (
              <View key={reservation.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                <View className={`px-4 py-2 ${reservation.status === "Upcoming" ? "bg-blue-500" : "bg-green-500"}`}>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white font-medium">{reservation.status}</Text>
                    <Text className="text-white text-xs">{reservation.date}</Text>
                  </View>
                </View>

                <View className="p-4">
                  <Text className="text-lg font-bold text-gray-800">{reservation.service}</Text>

                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-gray-700">⏰ {reservation.time}</Text>
                    <Text className="font-bold text-blue-500">{reservation.price}</Text>
                  </View>

                    <Text className="text-gray-700 mt-2">📍 {reservation.address}</Text>
                  <Text className="text-gray-700 mt-2">👤 {reservation.cleaner}</Text>

                  {reservation.status === "Upcoming" && (
                    <View className="flex-row mt-4">
                      <TouchableOpacity className="flex-1 mr-2">
                        <View className="border border-blue-500 rounded-lg py-3 items-center">
                          <Text className="text-blue-500 font-medium">Contact</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 ml-2">
                        <View className="bg-red-500 rounded-lg py-3 items-center">
                          <Text className="text-white font-medium">Cancel</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">Personal Information</Text>
              {!isEditing ? (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text className="text-blue-500 font-medium">Edit</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleSaveProfile}>
                  <Text className="text-green-500 font-medium">Save</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="bg-white rounded-lg shadow-sm mb-6">
              <View className="p-4 border-b border-gray-100">
                <Text className="text-gray-500 text-xs mb-1">Full Name</Text>
                {isEditing ? (
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    className="text-gray-800 font-medium border-b border-gray-200 py-1"
                  />
                ) : (
                  <Text className="text-gray-800 font-medium">{name}</Text>
                )}
              </View>

              <View className="p-4 border-b border-gray-100">
                <Text className="text-gray-500 text-xs mb-1">Email Address</Text>
                {isEditing ? (
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    className="text-gray-800 font-medium border-b border-gray-200 py-1"
                  />
                ) : (
                  <Text className="text-gray-800 font-medium">{email}</Text>
                )}
              </View>

              <View className="p-4 border-b border-gray-100">
                <Text className="text-gray-500 text-xs mb-1">Phone Number</Text>
                {isEditing ? (
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    className="text-gray-800 font-medium border-b border-gray-200 py-1"
                  />
                ) : (
                  <Text className="text-gray-800 font-medium">{phone}</Text>
                )}
              </View>

              <View className="p-4">
                <Text className="text-gray-500 text-xs mb-1">Home Address</Text>
                {isEditing ? (
                  <TextInput
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    numberOfLines={2}
                    className="text-gray-800 font-medium border-b border-gray-200 py-1"
                  />
                ) : (
                  <Text className="text-gray-800 font-medium">{address}</Text>
                )}
              </View>
            </View>

            {isEditing && (
              <CustomButton
                title="Save Changes"
                onPress={handleSaveProfile}
                style="bg-green-500 w-full py-4 rounded-lg shadow-sm mb-4"
              />
            )}

        
          </View>
        )}

        <View className="px-4 mb-10">
          <CustomButton title="Logout" onPress={handleLogout} style="bg-red-500 w-full py-4 rounded-lg shadow-sm" />
        </View>
      </Animated.ScrollView>
    </View>
  )
}


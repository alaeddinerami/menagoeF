import { View, Text, TouchableOpacity } from "react-native";

interface TabNavigationProps {
  activeTab: "reservations" | "personal";
  setActiveTab: (tab: "reservations" | "personal") => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
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
  );
}
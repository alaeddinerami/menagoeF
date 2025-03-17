import { useState, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Animated,
  Linking,
  Platform,
  RefreshControl,
  Image,
} from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Reservation = {
  _id: string
  cleaner: string
  client: string
  date: string
  Duration: number
  status: "pending" | "accepted" | "cancelled"
  Note: string
  __v: number
  clientName?: string
  clientImage?: string
  address?: string
  phone?: string
  serviceType?: string
}

const mockReservations: Reservation[] = [
  {
    _id: "67d179b580568df11945a581",
    cleaner: "67c98f12f3323d55d6a46db0",
    client: "67c98e91f3323d55d6a46da5",
    date: "2025-03-13T10:00:00.000+00:00",
    Duration: 60,
    status: "pending",
    Note: "Booking via app",
    __v: 0,
    clientName: "John Smith",
    clientImage: "https://randomuser.me/api/portraits/men/32.jpg",
    address: "123 Main St, Apt 4B, New York, NY 10001",
    phone: "(212) 555-1234",
    serviceType: "Regular Cleaning",
  },
  {
    _id: "67d179b580568df11945a582",
    cleaner: "67c98f12f3323d55d6a46db0",
    client: "67c98e91f3323d55d6a46da6",
    date: "2025-03-14T14:30:00.000+00:00",
    Duration: 120,
    status: "pending",
    Note: "Please bring eco-friendly products",
    __v: 0,
    clientName: "Sarah Johnson",
    clientImage: "https://randomuser.me/api/portraits/women/44.jpg",
    address: "456 Park Ave, Suite 7, New York, NY 10022",
    phone: "(212) 555-5678",
    serviceType: "Deep Cleaning",
  },
  {
    _id: "67d179b580568df11945a583",
    cleaner: "67c98f12f3323d55d6a46db0",
    client: "67c98e91f3323d55d6a46da7",
    date: "2025-03-15T09:00:00.000+00:00",
    Duration: 90,
    status: "accepted",
    Note: "Client has a dog",
    __v: 0,
    clientName: "Michael Brown",
    clientImage: "https://randomuser.me/api/portraits/men/22.jpg",
    address: "789 Broadway, New York, NY 10003",
    phone: "(212) 555-9012",
    serviceType: "Regular Cleaning",
  },
  {
    _id: "67d179b580568df11945a584",
    cleaner: "67c98f12f3323d55d6a46db0",
    client: "67c98e91f3323d55d6a46da8",
    date: "2025-03-12T13:00:00.000+00:00",
    Duration: 60,
    status: "cancelled",
    Note: "Cancelled by client",
    __v: 0,
    clientName: "Emily Davis",
    clientImage: "https://randomuser.me/api/portraits/women/28.jpg",
    address: "321 5th Ave, New York, NY 10016",
    phone: "(212) 555-3456",
    serviceType: "Window Cleaning",
  },
  {
    _id: "67d179b580568df11945a585",
    cleaner: "67c98f12f3323d55d6a46db0",
    client: "67c98e91f3323d55d6a46da9",
    date: "2025-03-16T11:00:00.000+00:00",
    Duration: 180,
    status: "pending",
    Note: "New client, first-time cleaning",
    __v: 0,
    clientName: "David Wilson",
    clientImage: "https://randomuser.me/api/portraits/men/42.jpg",
    address: "654 7th Ave, New York, NY 10019",
    phone: "(212) 555-7890",
    serviceType: "Deep Cleaning",
  },
]

export default function ReservationsScreen() {
  const insets = useSafeAreaInsets()
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "cancelled">("pending")
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  const scrollY = useRef(new Animated.Value(0)).current
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [160, 60],
    extrapolate: "clamp",
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }

  const calculateEndTime = (dateString: string, durationMinutes: number) => {
    const startDate = new Date(dateString)
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000)
    return endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }

  const getDatePart = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00`)
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  const filteredReservations = mockReservations.filter((reservation) => {
    const matchesTab = reservation.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      reservation.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.serviceType?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const groupedReservations = filteredReservations.reduce(
    (groups, reservation) => {
      const date = getDatePart(reservation.date)
      if (!groups[date]) groups[date] = []
      groups[date].push(reservation)
      return groups
    },
    {} as Record<string, Reservation[]>,
  )

  const sortedDates = Object.keys(groupedReservations).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  const handleCall = (phoneNumber?: string) => {
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`)
  }

  const handleGetDirections = (address?: string) => {
    if (!address) return
    const encodedAddress = encodeURIComponent(address)
    const url = Platform.select({
      ios: `maps:0,0?q=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
    })
    if (url) Linking.openURL(url)
  }

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  const renderReservationCard = ({ item }: { item: Reservation }) => {
    const isExpanded = expandedCardId === item._id
    const statusConfig = {
      pending: { bgColor: "bg-indigo-100", textColor: "text-indigo-800", icon: "time-outline", iconColor: "#6366f1" },
      accepted: { bgColor: "bg-green-100", textColor: "text-green-800", icon: "checkmark-circle-outline", iconColor: "#10b981" },
      cancelled: { bgColor: "bg-red-100", textColor: "text-red-800", icon: "close-circle-outline", iconColor: "#ef4444" },
    }
    const statusInfo = statusConfig[item.status]
    const startTime = formatTime(item.date)
    const endTime = calculateEndTime(item.date, item.Duration)
    const timeRange = `${startTime} - ${endTime}`
    const formatDuration = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    }

    return (
      <TouchableOpacity
        className={`bg-white rounded-2xl mb-4 shadow-md overflow-hidden border ${isExpanded ? "border-indigo-300" : "border-gray-100"}`}
        onPress={() => setExpandedCardId(isExpanded ? null : item._id)}
        activeOpacity={0.8}
      >
        <View className="p-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              {item.clientImage ? (
                <Image source={{ uri: item.clientImage }} className="w-12 h-12 rounded-full mr-3" />
              ) : (
                <View className="w-12 h-12 rounded-full bg-gray-100 mr-3 items-center justify-center">
                  <Text className="text-gray-500 text-lg font-bold">{item.clientName?.charAt(0) || "?"}</Text>
                </View>
              )}
              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900">{item.clientName || "Unknown Client"}</Text>
                <Text className="text-sm text-gray-500">{item.serviceType || "Service"}</Text>
              </View>
            </View>
            <View className={`px-3 py-1.5 rounded-full flex-row items-center ${statusInfo.bgColor}`}>
              <Ionicons name={statusInfo.icon} size={16} color={statusInfo.iconColor} />
              <Text className={`ml-1 text-sm font-semibold ${statusInfo.textColor}`}>{item.status}</Text>
            </View>
          </View>

          <View className="mt-4 space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={18} color="#6b7280" />
              <Text className="ml-2 text-gray-700 text-base">{formatDate(item.date)}</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="clock-time-four-outline" size={18} color="#6b7280" />
              <Text className="ml-2 text-gray-700 text-base">{timeRange}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="hourglass-outline" size={18} color="#6b7280" />
              <Text className="ml-2 text-gray-700 text-base">{formatDuration(item.Duration)}</Text>
            </View>
          </View>

          {item.address && (
            <View className="mt-3 flex-row items-start">
              <Ionicons name="location-outline" size={18} color="#6b7280" className="mt-0.5" />
              <Text className="ml-2 text-gray-600 text-sm flex-1">{item.address}</Text>
            </View>
          )}
        </View>

        {isExpanded && (
          <View className="px-5 pb-5 pt-2 bg-indigo-50">
            {item.Note && (
              <View className="mb-4">
                <Text className="font-semibold text-gray-800 text-base">Notes</Text>
                <Text className="text-gray-600 text-sm mt-1">{item.Note}</Text>
              </View>
            )}
            <View className="mb-4">
              <Text className="font-semibold text-gray-800 text-base">Details</Text>
              <View className="bg-white p-3 rounded-xl mt-1 shadow-sm">
                <View className="flex-row justify-between py-1">
                  <Text className="text-gray-500 text-sm">Reservation ID</Text>
                  <Text className="text-gray-700 text-sm font-medium">{item._id.slice(-8)}</Text>
                </View>
                <View className="flex-row justify-between py-1">
                  <Text className="text-gray-500 text-sm">Cleaner ID</Text>
                  <Text className="text-gray-700 text-sm font-medium">{item.cleaner.slice(-8)}</Text>
                </View>
              </View>
            </View>
            <View className="flex-row gap-3">
              {item.phone && (
                <TouchableOpacity
                  className="flex-1 bg-indigo-600 py-3 rounded-xl flex-row justify-center items-center shadow-md"
                  onPress={() => handleCall(item.phone)}
                >
                  <Ionicons name="call-outline" size={18} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">Call</Text>
                </TouchableOpacity>
              )}
              {item.address && (
                <TouchableOpacity
                  className="flex-1 bg-indigo-600 py-3 rounded-xl flex-row justify-center items-center shadow-md"
                  onPress={() => handleGetDirections(item.address)}
                >
                  <Ionicons name="navigate-outline" size={18} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">Directions</Text>
                </TouchableOpacity>
              )}
              {item.status === "pending" && (
                <TouchableOpacity
                  className="flex-1 bg-green-600 py-3 rounded-xl flex-row justify-center items-center shadow-md"
                  onPress={() => console.log(`Accept job ${item._id}`)}
                >
                  <Ionicons name="checkmark-outline" size={18} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">Accept</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const renderSectionHeader = (date: string) => (
    <View className="mb-3 mt-5 px-5">
      <Text className="text-xl font-bold text-gray-900">{formatDateHeader(date)}</Text>
      <View className="h-0.5 bg-indigo-100 mt-1 rounded-full" />
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-100" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      <Animated.View
        style={{ height: headerHeight }}
        className="bg-indigo-500 px-5 pb-4 shadow-lg"
      >
        <View className="flex-row justify-between items-center pt-3">
          <Text className="text-3xl font-extrabold text-white tracking-tight">Reservations</Text>
        </View>
        <Animated.View
          style={{
            opacity: scrollY.interpolate({
              inputRange: [0, 80],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
          }}
          className="mt-2"
        >
          <Text className="text-indigo-100 text-base">Your upcoming cleaning schedule</Text>
          <View className="bg-indigo-400 rounded-xl flex-row items-center px-3 mt-3 shadow-sm">
            <Ionicons name="search-outline" size={20} color="#ffffff" />
            <TextInput
              className="flex-1 ml-2 text-white text-base placeholder:text-indigo-200"
              placeholder="Search clients or services..."
              placeholderTextColor="#c7d2fe"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </Animated.View>

      <View className="flex-row justify-center bg-white py-3 shadow-sm border-b border-gray-200">
        <View className="flex-row bg-gray-100 rounded-full p-1">
          {(["pending", "accepted", "cancelled"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-5 py-2 rounded-full ${activeTab === tab ? "bg-indigo-600 shadow-md" : ""}`}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                className={`text-sm font-semibold capitalize ${activeTab === tab ? "text-white" : "text-gray-700"}`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.FlatList
        data={sortedDates}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View>
            {renderSectionHeader(date)}
            {groupedReservations[date].map((reservation) => (
              <View key={reservation._id} className="px-5">
                {renderReservationCard({ item: reservation })}
              </View>
            ))}
          </View>
        )}
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-24">
            <Ionicons name="list-outline" size={64} color="#d1d5db" />
            <Text className="mt-4 text-gray-500 text-lg font-medium">No {activeTab} reservations</Text>
            {searchQuery !== "" && (
              <TouchableOpacity
                className="mt-3 bg-indigo-100 px-5 py-2 rounded-full shadow-sm"
                onPress={() => setSearchQuery("")}
              >
                <Text className="text-indigo-600 font-semibold">Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  )
}
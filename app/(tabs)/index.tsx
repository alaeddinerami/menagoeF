import { useFocusEffect } from "@react-navigation/native"
import { router } from "expo-router"
import { useCallback, useState } from "react"
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { fetchCleaners } from "~/redux/slices/cleanersSlice"
import type { AppDispatch, RootState } from "~/redux/store"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"


const { width } = Dimensions.get("window")

const CleanersScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string |null>(null)

  const getAvailability = (id: string) => {
    return id.charCodeAt(0) % 2 === 0
  }

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        dispatch(fetchCleaners())
      }
    }, [dispatch, isAuthenticated]),
  )

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    dispatch(fetchCleaners()).finally(() => setRefreshing(false))
  }, [dispatch])

 

  const handleChats = () => {
  
    router.push("/chatScreen/ChatItem")
  }

 const getLocations = () => {
    const locations = cleaners.map((cleaner) => cleaner.location)
    return ['all', ...Array.from(new Set(locations))]
 }

  const filterCleaners = () => {
    let filteredList = [...cleaners]

    if (searchQuery) {
      filteredList = filteredList.filter(
        (cleaner) =>
          cleaner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cleaner.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedLocation  && selectedLocation!== "all") {
      filteredList = filteredList.filter((cleaner) => cleaner.location === selectedLocation.toLowerCase())
    }

    return filteredList
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.authGradient}>
          <Ionicons name="lock-closed" size={64} color="#fff" />
          <Text style={styles.authText}>Please log in to view cleaners.</Text>
          <TouchableOpacity style={styles.authButton} onPress={() => router.push("/login")}>
            <Text style={styles.authButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <View style={styles.container}>
        <LinearGradient colors={["#6366F1", "#8B5CF6"]} style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{user?.user?.name || "User"}</Text>
          </View>
          <TouchableOpacity style={styles.chatButton} onPress={handleChats}>
            <Ionicons name="chatbubbles" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#a0aec0" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cleaners by name or location"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#a0aec0"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#a0aec0" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by:</Text>
          <View style={styles.filterOptions}>
            {getLocations().map((location:string) => (

              <TouchableOpacity
                key={location}
                style={[styles.filterOption, selectedLocation === location.toLowerCase() && styles.activeFilterOption]}
                onPress={() => setSelectedLocation(location.toLowerCase() as FilterOption)}
              >
                <Text style={[styles.filterOptionText, selectedLocation === location.toLowerCase() && styles.activeFilterOptionText]}>
                  {location}
                </Text>
              </TouchableOpacity>
            ))}

           
          </View>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading cleaners...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color="#F43F5E" />
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(fetchCleaners())}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filterCleaners()}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#6366F1"]}
                tintColor="#6366F1"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={64} color="#CBD5E0" />
                <Text style={styles.emptyText}>No cleaners found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
              </View>
            }
            renderItem={({ item }) => {
              const imagePath = `${process.env.EXPO_PUBLIC_API_URL}/${item.image}`
              const isAvailable = getAvailability(item._id)

              return (
                <View style={styles.cleanerCard}>
                  <TouchableOpacity
                    style={styles.cardContent}
                    onPress={() => router.push(`/cleanerDetails/${item._id}` as any)}
                  >
                    <View style={styles.imageContainer}>
                      {item.image ? (
                        <Image source={{ uri: imagePath }} style={styles.image} resizeMode="cover" />
                      ) : (
                        <View style={styles.noImageContainer}>
                          <Ionicons name="person" size={40} color="#CBD5E0" />
                        </View>
                      )}
                    </View>
                    <View style={styles.cleanerInfo}>
                      <Text style={styles.cleanerName}>{item.name}</Text>

                      <View style={styles.infoRow}>
                        <Ionicons name="location" size={16} color="#6366F1" />
                        <Text style={styles.infoText}>{item.location}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Ionicons name="mail" size={16} color="#6366F1" />
                        <Text style={styles.infoText}>{item.email}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Ionicons name="call" size={16} color="#6366F1" />
                        <Text style={styles.infoText}>{item.phone}</Text>
                      </View>

                     
                    </View>
                  </TouchableOpacity>
                </View>
              )
            }}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#6366F1",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  chatButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#4a5568",
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: "row",
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f7fafc",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeFilterOption: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a5568",
  },
  activeFilterOptionText: {
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 80,
    padding: 20,
    paddingTop: 8,
  },
  cleanerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
  },
  imageContainer: {
    position: "relative",
    marginRight: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  noImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  availabilityBadge: {
    position: "absolute",
    bottom: -8,
    left: 0,
    right: 0,
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  availableBadge: {
    backgroundColor: "rgba(72, 187, 120, 0.95)",
  },
  unavailableBadge: {
    backgroundColor: "rgba(245, 101, 101, 0.95)",
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  availableText: {
    color: "#fff",
  },
  unavailableText: {
    color: "#fff",
  },
  cleanerInfo: {
    flex: 1,
  },
  cleanerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#4a5568",
    marginLeft: 6,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4a5568",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4a5568",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#6366F1",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4a5568",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  authContainer: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  authGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  authButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default CleanersScreen
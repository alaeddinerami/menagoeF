"use client"
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
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "~/redux/slices/authSlice"
import { fetchCleaners } from "~/redux/slices/cleanersSlice"
import type { AppDispatch, RootState } from "~/redux/store"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"

// Define filter options
type FilterOption = "all" | "available" | "unavailable"

const CleanersScreen = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

  // Local state
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all")

  // For demo purposes, we'll randomly assign availability to cleaners
  const getAvailability = (id: string) => {
    // This is just for demo - in a real app, you'd get this from your API
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

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => dispatch(logout()), style: "destructive" },
    ])
  }

  const handleMessageCleaner = (cleanerId: string, cleanerName: string) => {
    // In a real app, this would navigate to a chat screen
    Alert.alert("Message Cleaner", `You'll be able to message ${cleanerName} here.`, [{ text: "OK" }])
  }

  const filterCleaners = () => {
    let filteredList = [...cleaners]

    // Apply search filter
    if (searchQuery) {
      filteredList = filteredList.filter(
        (cleaner) =>
          cleaner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cleaner.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply availability filter
    if (activeFilter !== "all") {
      filteredList = filteredList.filter((cleaner) => {
        const isAvailable = getAvailability(cleaner._id)
        return activeFilter === "available" ? isAvailable : !isAvailable
      })
    }

    return filteredList
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Ionicons name="lock-closed" size={64} color="#6366F1" />
        <Text style={styles.authText}>Please log in to view cleaners.</Text>
        <TouchableOpacity style={styles.authButton} onPress={() => router.push("/login")}>
          <Text style={styles.authButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{user?.user?.name || "User"}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
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

        {/* Filter Options */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by:</Text>
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={[styles.filterOption, activeFilter === "all" && styles.activeFilterOption]}
              onPress={() => setActiveFilter("all")}
            >
              <Text style={[styles.filterOptionText, activeFilter === "all" && styles.activeFilterOptionText]}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, activeFilter === "available" && styles.activeFilterOption]}
              onPress={() => setActiveFilter("available")}
            >
              <Text style={[styles.filterOptionText, activeFilter === "available" && styles.activeFilterOptionText]}>
                Available
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterOption, activeFilter === "unavailable" && styles.activeFilterOption]}
              onPress={() => setActiveFilter("unavailable")}
            >
              <Text style={[styles.filterOptionText, activeFilter === "unavailable" && styles.activeFilterOptionText]}>
                Unavailable
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cleaners List */}
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
                      <View
                        style={[
                          styles.availabilityBadge,
                          isAvailable ? styles.availableBadge : styles.unavailableBadge,
                        ]}
                      >
                        <Text
                          style={[styles.availabilityText, isAvailable ? styles.availableText : styles.unavailableText]}
                        >
                          {isAvailable ? "Available" : "Unavailable"}
                        </Text>
                      </View>
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

                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => router.push(`/cleanerDetails/${item._id}` as any)}
                        >
                          <Ionicons name="calendar" size={18} color="#6366F1" />
                          <Text style={styles.actionButtonText}>Book</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleMessageCleaner(item._id, item.name)}
                        >
                          <Ionicons name="chatbubble" size={18} color="#6366F1" />
                          <Text style={styles.actionButtonText}>Message</Text>
                        </TouchableOpacity>
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  welcomeText: {
    fontSize: 14,
    color: "#718096",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3748",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f7fafc",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#4a5568",
    paddingVertical: 0, // Fixes height issues on Android
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f7fafc",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeFilterOption: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#4a5568",
  },
  activeFilterOptionText: {
    color: "#fff",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  cleanerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    borderRadius: 8,
  },
  noImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#f7fafc",
    justifyContent: "center",
    alignItems: "center",
  },
  availabilityBadge: {
    position: "absolute",
    bottom: -6,
    left: 0,
    right: 0,
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 4,
  },
  availableBadge: {
    backgroundColor: "rgba(72, 187, 120, 0.9)",
  },
  unavailableBadge: {
    backgroundColor: "rgba(245, 101, 101, 0.9)",
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
  cardActions: {
    flexDirection: "row",
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF4FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "500",
    marginLeft: 4,
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7fafc",
  },
  authText: {
    fontSize: 18,
    color: "#4a5568",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  authButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#6366F1",
    borderRadius: 8,
  },
  authButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default CleanersScreen


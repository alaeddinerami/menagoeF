"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  Platform,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch, RootState } from "~/redux/store"
import { fetchCleaners } from "~/redux/slices/cleanersSlice"
import { Calendar, type DateData } from "react-native-calendars"
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")
const BASE_URL = process.env.EXPO_PUBLIC_API_URL

// Types for scheduling
interface TimeSlot {
  id: string
  time: string
  isAvailable: boolean
}

interface ScheduleData {
  [date: string]: {
    slots: TimeSlot[]
    marked: boolean
    dotColor: string
  }
}

const CleanerDetails = () => {
  const { id } = useLocalSearchParams()
  const dispatch = useDispatch<AppDispatch>()
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners)
  const router = useRouter()

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0]
  const slideAnim = useState(new Animated.Value(50))[0]

  // State for scheduling
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [scheduleData, setScheduleData] = useState<ScheduleData>({})
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({})
  const [loadingSchedule, setLoadingSchedule] = useState(false)
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (!cleaners.length) {
      dispatch(fetchCleaners())
    }
  }, [dispatch])

  // Fetch schedule data for the cleaner
  useEffect(() => {
    if (id) {
      fetchScheduleData()
    }
  }, [id])

  // Animation when component mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Animation when slot is selected
  useEffect(() => {
    if (selectedSlot) {
      setShowConfirmation(true)
    } else {
      setShowConfirmation(false)
    }
  }, [selectedSlot])

  // Mock function to fetch schedule data - replace with actual API call
  const fetchScheduleData = async () => {
    setLoadingSchedule(true)
    try {
      // This would be your actual API call
      // const response = await fetch(`${BASE_URL}/cleaners/${id}/schedule`);
      // const data = await response.json();

      // Mock data for demonstration
      const today = new Date()
      const mockData: ScheduleData = {}

      // Generate mock data for the next 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const dateString = date.toISOString().split("T")[0]

        // Create some random availability
        const hasAvailability = Math.random() > 0.3
        const slots: TimeSlot[] = []

        if (hasAvailability) {
          // Generate time slots from 9 AM to 5 PM
          for (let hour = 9; hour < 17; hour++) {
            slots.push({
              id: `${dateString}-${hour}`,
              time: `${hour}:00 - ${hour + 1}:00`,
              isAvailable: Math.random() > 0.4, // Some slots are available, some are not
            })
          }
        }

        mockData[dateString] = {
          slots,
          marked: hasAvailability,
          dotColor: hasAvailability ? "#4CAF50" : "#F44336",
        }
      }

      setScheduleData(mockData)

      // Update marked dates for the calendar
      const marked: { [date: string]: any } = {}
      Object.keys(mockData).forEach((date) => {
        const hasAvailableSlot = mockData[date].slots.some((slot) => slot.isAvailable)
        marked[date] = {
          marked: true,
          dotColor: hasAvailableSlot ? "#4CAF50" : "#F44336",
        }
      })

      setMarkedDates(marked)
    } catch (error) {
      console.error("Error fetching schedule:", error)
      Alert.alert("Error", "Failed to load schedule data")
    } finally {
      setLoadingSchedule(false)
    }
  }

  const handleDateSelect = (date: DateData) => {
    setSelectedDate(date.dateString)
    setSelectedSlot(null) // Reset selected slot when date changes
  }

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.isAvailable) return
    setSelectedSlot(slot)
  }

  const handleBookSlot = async () => {
    if (!selectedDate || !selectedSlot) return

    setBookingInProgress(true)

    try {
      // This would be your actual booking API call
      // await fetch(`${BASE_URL}/bookings`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     cleanerId: id,
      //     date: selectedDate,
      //     slotId: selectedSlot.id
      //   })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state to reflect booking
      setScheduleData((prev) => {
        const updatedData = { ...prev }
        if (updatedData[selectedDate]) {
          updatedData[selectedDate].slots = updatedData[selectedDate].slots.map((slot) =>
            slot.id === selectedSlot.id ? { ...slot, isAvailable: false } : slot,
          )

          // Check if there are any available slots left
          const hasAvailableSlot = updatedData[selectedDate].slots.some((slot) => slot.isAvailable)

          // Update marked dates
          setMarkedDates((prev) => ({
            ...prev,
            [selectedDate]: {
              ...prev[selectedDate],
              dotColor: hasAvailableSlot ? "#4CAF50" : "#F44336",
            },
          }))
        }
        return updatedData
      })

      Alert.alert(
        "Booking Confirmed",
        `Your appointment has been scheduled for ${selectedDate} at ${selectedSlot.time}`,
        [{ text: "OK", onPress: () => setSelectedSlot(null) }],
      )
    } catch (error) {
      console.error("Error booking slot:", error)
      Alert.alert("Error", "Failed to book appointment. Please try again.")
    } finally {
      setBookingInProgress(false)
    }
  }

  const cleaner = cleaners.find((c) => c._id === id)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading cleaner details...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#F43F5E" />
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (!cleaner) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="person-outline" size={48} color="#F43F5E" />
        <Text style={styles.errorText}>Cleaner not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const imageUrl = cleaner.image ? `${BASE_URL}/${cleaner.image}` : null

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <View style={styles.container}>
      {/* Header with blur effect */}
      <BlurView intensity={80} tint="light" style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#6366F1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cleaner Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="heart-outline" size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.profileSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
            colors={["#6366F1", "#8B5CF6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.profileHeader}
          >
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.profileImage} resizeMode="cover" />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <FontAwesome5 name="user-alt" size={40} color="#fff" />
              </View>
            )}

            <View style={styles.profileNameContainer}>
              <Text style={styles.profileName}>{cleaner.name}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= 4 ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                    style={styles.starIcon}
                  />
                ))}
                <Text style={styles.ratingText}>4.0</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="location" size={20} color="#6366F1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{cleaner.location}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="mail" size={20} color="#6366F1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{cleaner.email}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <Ionicons name="call" size={20} color="#6366F1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{cleaner.phone}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIconContainer}>
                <MaterialCommunityIcons name="broom" size={20} color="#6366F1" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Experience</Text>
                <Text style={styles.detailValue}>5+ years</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.schedulingSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#6366F1" />
            <Text style={styles.sectionTitle}>Book an Appointment</Text>
          </View>

          {loadingSchedule ? (
            <View style={styles.loadingSchedule}>
              <ActivityIndicator size="small" color="#6366F1" />
              <Text style={styles.loadingText}>Loading availability...</Text>
            </View>
          ) : (
            <>
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={{
                    ...markedDates,
                    [selectedDate || ""]: {
                      ...(markedDates[selectedDate || ""] || {}),
                      selected: true,
                      selectedColor: "#6366F1",
                    },
                  }}
                  theme={{
                    backgroundColor: "transparent",
                    calendarBackground: "transparent",
                    textSectionTitleColor: "#6366F1",
                    selectedDayBackgroundColor: "#6366F1",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#6366F1",
                    dayTextColor: "#2d3748",
                    textDisabledColor: "#a0aec0",
                    dotColor: "#6366F1",
                    selectedDotColor: "#ffffff",
                    arrowColor: "#6366F1",
                    monthTextColor: "#2d3748",
                    indicatorColor: "#6366F1",
                    textDayFontFamily: "System",
                    textMonthFontFamily: "System",
                    textDayHeaderFontFamily: "System",
                    textDayFontWeight: "400",
                    textMonthFontWeight: "bold",
                    textDayHeaderFontWeight: "600",
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14,
                  }}
                />
              </View>

              {selectedDate && (
                <View style={styles.selectedDateContainer}>
                  <Ionicons name="today" size={20} color="#6366F1" />
                  <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
                </View>
              )}

              {selectedDate && scheduleData[selectedDate]?.slots.length > 0 ? (
                <View style={styles.timeSlots}>
                  <Text style={styles.timeSlotsHeader}>Available Time Slots</Text>
                  <View style={styles.timeSlotsGrid}>
                    {scheduleData[selectedDate].slots.map((slot) => (
                      <TouchableOpacity
                        key={slot.id}
                        style={[
                          styles.timeSlot,
                          !slot.isAvailable && styles.unavailableSlot,
                          selectedSlot?.id === slot.id && styles.selectedTimeSlot,
                        ]}
                        onPress={() => handleSlotSelect(slot)}
                        disabled={!slot.isAvailable}
                        activeOpacity={0.7}
                      >
                        <View style={styles.timeSlotContent}>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color={selectedSlot?.id === slot.id ? "#fff" : slot.isAvailable ? "#6366F1" : "#a0aec0"}
                          />
                          <Text
                            style={[
                              styles.timeSlotText,
                              !slot.isAvailable && styles.unavailableSlotText,
                              selectedSlot?.id === slot.id && styles.selectedSlotText,
                            ]}
                          >
                            {slot.time}
                          </Text>
                        </View>

                        {slot.isAvailable ? (
                          <View
                            style={[
                              styles.availabilityBadge,
                              selectedSlot?.id === slot.id && styles.selectedAvailabilityBadge,
                            ]}
                          >
                            <Text
                              style={[
                                styles.availabilityText,
                                selectedSlot?.id === slot.id && styles.selectedAvailabilityText,
                              ]}
                            >
                              Available
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.bookedBadge}>
                            <Text style={styles.bookedText}>Booked</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : selectedDate ? (
                <View style={styles.noSlots}>
                  <MaterialCommunityIcons name="calendar-remove" size={60} color="#cbd5e0" />
                  <Text style={styles.noSlotsText}>No available slots for this date</Text>
                  <Text style={styles.noSlotsSubtext}>Please select another date</Text>
                </View>
              ) : null}
            </>
          )}
        </Animated.View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Booking confirmation panel */}
      {showConfirmation && selectedSlot && (
        <Animated.View style={[styles.confirmationPanel, { opacity: fadeAnim }]}>
          <BlurView intensity={90} tint="light" style={styles.confirmationBlur}>
            <View style={styles.confirmationContent}>
              <View style={styles.confirmationHeader}>
                <Text style={styles.confirmationTitle}>Confirm Booking</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedSlot(null)}>
                  <Ionicons name="close" size={24} color="#6366F1" />
                </TouchableOpacity>
              </View>

              <View style={styles.confirmationDetails}>
                <View style={styles.confirmationItem}>
                  <Ionicons name="person" size={20} color="#6366F1" />
                  <Text style={styles.confirmationText}>
                    <Text style={styles.confirmationLabel}>Cleaner: </Text>
                    {cleaner.name}
                  </Text>
                </View>

                <View style={styles.confirmationItem}>
                  <Ionicons name="calendar" size={20} color="#6366F1" />
                  <Text style={styles.confirmationText}>
                    <Text style={styles.confirmationLabel}>Date: </Text>
                    {formatDate(selectedDate || "")}
                  </Text>
                </View>

                <View style={styles.confirmationItem}>
                  <Ionicons name="time" size={20} color="#6366F1" />
                  <Text style={styles.confirmationText}>
                    <Text style={styles.confirmationLabel}>Time: </Text>
                    {selectedSlot.time}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleBookSlot}
                disabled={bookingInProgress}
                activeOpacity={0.8}
              >
                {bookingInProgress ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4a5568",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7fafc",
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4a5568",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(203, 213, 224, 0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
  },
  headerRight: {
    flexDirection: "row",
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileSection: {
    marginTop: Platform.OS === "ios" ? 100 : 70,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileNameContainer: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "600",
  },
  profileDetails: {
    padding: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#2d3748",
    fontWeight: "500",
  },
  schedulingSection: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
    marginLeft: 8,
  },
  calendarContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(237, 242, 247, 0.5)",
    marginBottom: 16,
    padding: 8,
  },
  loadingSchedule: {
    padding: 40,
    alignItems: "center",
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedDateText: {
    fontSize: 16,
    color: "#4a5568",
    fontWeight: "500",
    marginLeft: 8,
  },
  timeSlots: {
    marginTop: 8,
  },
  timeSlotsHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 12,
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  timeSlot: {
    width: "48%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "rgba(237, 242, 247, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  unavailableSlot: {
    backgroundColor: "rgba(237, 242, 247, 0.4)",
    borderColor: "rgba(160, 174, 192, 0.2)",
  },
  selectedTimeSlot: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  timeSlotContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  timeSlotText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4a5568",
    marginLeft: 6,
  },
  unavailableSlotText: {
    color: "#a0aec0",
  },
  selectedSlotText: {
    color: "#fff",
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: "rgba(72, 187, 120, 0.1)",
    alignSelf: "flex-start",
  },
  selectedAvailabilityBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  availabilityText: {
    fontSize: 12,
    color: "#48bb78",
    fontWeight: "500",
  },
  selectedAvailabilityText: {
    color: "#fff",
  },
  bookedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: "rgba(245, 101, 101, 0.1)",
    alignSelf: "flex-start",
  },
  bookedText: {
    fontSize: 12,
    color: "#f56565",
    fontWeight: "500",
  },
  noSlots: {
    alignItems: "center",
    padding: 30,
  },
  noSlotsText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4a5568",
    fontWeight: "500",
    textAlign: "center",
  },
  noSlotsSubtext: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginTop: 4,
  },
  confirmationPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  confirmationBlur: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  confirmationContent: {
    padding: 20,
  },
  confirmationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(237, 242, 247, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationDetails: {
    backgroundColor: "rgba(237, 242, 247, 0.5)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  confirmationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 16,
    color: "#4a5568",
    marginLeft: 10,
  },
  confirmationLabel: {
    fontWeight: "600",
    color: "#2d3748",
  },
  confirmButton: {
    backgroundColor: "#6366F1",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#6366F1",
    borderRadius: 12,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  spacer: {
    height: 100,
  },
})

export default CleanerDetails


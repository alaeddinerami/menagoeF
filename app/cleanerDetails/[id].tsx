import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "~/redux/store";
import { fetchCleaners } from "~/redux/slices/cleanersSlice";
import { Calendar, type DateData } from "react-native-calendars";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { fetchAvailability, createReservation } from "~/redux/slices/reservationsSlice";

const { width } = Dimensions.get("window");
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

interface Reservation {
  _id: string;
  date: string;
}

interface ScheduleData {
  [date: string]: {
    isAvailable: boolean;
    marked: boolean;
    dotColor: string;
  };
}

const CleanerDetails = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners);
  const { reservations, loading: availabilityLoading, error: availabilityError } = useSelector(
    (state: RootState) => state.reservations
  );
  const router = useRouter();

  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (!cleaners.length) {
      dispatch(fetchCleaners());
    }
    if (id) {
      dispatch(fetchAvailability(id.toString()));
    }
  }, [dispatch, id, cleaners.length]);

  useEffect(() => {
    if (reservations && id) {
      setLoadingSchedule(true);
      try {
        const scheduleData: ScheduleData = {};
        const marked: { [date: string]: any } = {};

        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateString = date.toISOString().split("T")[0];

          const isBooked = reservations.some(
            (res: Reservation) => res.date.split("T")[0] === dateString
          );

          const isAvailable = !isBooked; 

          scheduleData[dateString] = {
            isAvailable,
            marked: true,
            dotColor: isAvailable ? "#4CAF50" : "#F44336", 
          };

          marked[dateString] = {
            marked: true,
            dotColor: isAvailable ? "#4CAF50" : "#F44336", 
            selectedColor: "#6366F1",
            customStyles: {
              container: {
                backgroundColor: isAvailable ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                borderRadius: 8,
              },
              text: {
                color: isAvailable ? "#1b5e20" : "#b71c1c",
                fontWeight: "500",
              },
            },
          };
        }

        setScheduleData(scheduleData);
        setMarkedDates(marked);
      } catch (error) {
        console.error("Error processing availability:", error);
        Alert.alert("Error", "Failed to process availability data");
      } finally {
        setLoadingSchedule(false);
      }
    }
  }, [reservations, id]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (selectedDate && showConfirmation) {}
  }, [selectedDate, showConfirmation]);

  const handleDateSelect = (date: DateData) => {
    setSelectedDate(date.dateString);
    setShowConfirmation(false);
  };

  const handleDateConfirmation = () => {
    if (!selectedDate) return;
    if (!scheduleData[selectedDate]?.isAvailable) {
      Alert.alert("Not Available", "This date is already booked. Please select another date.");
      return;
    }
    setShowConfirmation(true);
  };

  const handleBookSlot = async () => {
    if (!selectedDate || !id) return;

    setBookingInProgress(true);

    try {
      const resultAction = await dispatch(
        createReservation({
          cleanerId: id.toString(),
          date: `${selectedDate}T10:00:00.000Z`,
          duration: 60,
          notes: "Booking via app",
        })
      );

      if (createReservation.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string);
      }

      await dispatch(fetchAvailability(id.toString()));

      Alert.alert("Booking Confirmed", `Your appointment has been scheduled for ${formatDate(selectedDate)}`, [
        {
          text: "OK",
          onPress: () => {
            setShowConfirmation(false);
            setSelectedDate(null);
          },
        },
      ]);
    } catch (error:any) {
      console.error("Error booking date:", error);
      Alert.alert("Error", error.message || "Failed to book appointment. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  const cleaner = cleaners.find((c) => c._id === id);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="mt-3 text-base text-gray-600 font-medium">Loading cleaner details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-5 bg-gray-100">
        <Ionicons name="alert-circle" size={48} color="#F43F5E" />
        <Text className="mt-3 text-base text-gray-600 text-center">Error: {error}</Text>
        <TouchableOpacity className="mt-5 py-3 px-6 bg-indigo-600 rounded-xl" onPress={() => router.back()}>
          <Text className="text-white text-base font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!cleaner) {
    return (
      <View className="flex-1 justify-center items-center px-5 bg-gray-100">
        <Ionicons name="person-outline" size={48} color="#F43F5E" />
        <Text className="mt-3 text-base text-gray-600 text-center">Cleaner not found</Text>
        <TouchableOpacity className="mt-5 py-3 px-6 bg-indigo-600 rounded-xl" onPress={() => router.back()}>
          <Text className="text-white text-base font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = cleaner.image ? `${BASE_URL}/${cleaner.image}` : null;
const sendCleaner = () => {
  const cleanerData = encodeURIComponent(JSON.stringify(cleaner));
  router.push(`/chatScreen/chat?cleaner=${cleanerData}`);
}
  return (
    <View className="flex-1 bg-gray-100">
      <BlurView intensity={80} tint="light" className="flex-row items-center justify-between pt-8 pb-4 px-4 absolute top-0 left-0 right-0 z-10 border-b border-gray-300/30">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white/80 justify-center items-center shadow-md" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#6366F1" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Cleaner Profile {cleaner._id}</Text>
        <View className="flex-row">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/80 justify-center items-center shadow-md"
          onPress={sendCleaner}>
          <Ionicons name="chatbox-ellipses" size={24} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="mt-24 mx-4 rounded-2xl bg-white overflow-hidden shadow-lg"
        >
          <LinearGradient colors={["#000", "#8B5CF6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="flex-row items-center p-4">
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} className="w-20 h-20 rounded-full border-2 border-white" resizeMode="cover" />
            ) : (
              <View className="w-20 h-20 rounded-full bg-white/20 justify-center items-center border-2 border-white">
                <FontAwesome5 name="user-alt" size={40} color="#fff" />
              </View>
            )}
            <View className="ml-4">
              <Text className="text-2xl font-bold text-white mb-1">{cleaner.name}</Text>
              <View className="flex-row items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= 4 ? "star" : "star-outline"}
                    size={16}
                    color="#FFD700"
                    className="mr-1"
                  />
                ))}
                <Text className="text-white ml-1 font-semibold">4.0</Text>
              </View>
            </View>
          </LinearGradient>

          <View className="p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-indigo-100/50 justify-center items-center mr-3">
                <Ionicons name="location" size={20} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">Location</Text>
                <Text className="text-base text-gray-800 font-medium">{cleaner.location}</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-indigo-100/50 justify-center items-center mr-3">
                <Ionicons name="mail" size={20} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">Email</Text>
                <Text className="text-base text-gray-800 font-medium">{cleaner.email}</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-indigo-100/50 justify-center items-center mr-3">
                <Ionicons name="call" size={20} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">Phone</Text>
                <Text className="text-ba57575e text-gray-800 font-medium">{cleaner.phone}</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full bg-indigo-100/50 justify-center items-center mr-3">
                <MaterialCommunityIcons name="broom" size={20} color="#6366F1" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">Experience</Text>
                <Text className="text-base text-gray-800 font-medium">5+ years</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          className="mt-4 mx-4 rounded-2xl bg-white p-4 shadow-lg"
        >
          <View className="flex-row items-center mb-4">
            <MaterialCommunityIcons name="calendar-clock" size={24} color="#6366F1" />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Book an Appointment</Text>
          </View>

          {loadingSchedule || availabilityLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="small" color="#6366F1" />
              <Text className="mt-3 text-base text-gray-600 font-medium">Loading availability...</Text>
            </View>
          ) : availabilityError ? (
            <View className="items-center">
              <Ionicons name="alert-circle" size={48} color="#F43F5E" />
              <Text className="mt-3 text-base text-gray-600 text-center">Error: {availabilityError}</Text>
            </View>
          ) : (
            <>
              <View className="rounded-xl overflow-hidden bg-gray-200/50 mb-4 p-2">
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={{
                    ...markedDates,
                    [selectedDate || ""]: {
                      ...(markedDates[selectedDate || ""] || {}),
                      selected: true,
                      selectedColor: "#6366F1",
                      customStyles: {
                        ...(markedDates[selectedDate || ""]?.customStyles || {}),
                        container: {
                          backgroundColor:
                            selectedDate && scheduleData[selectedDate]?.isAvailable
                              ? "rgba(99, 102, 241, 0.2)"
                              : "rgba(244, 67, 54, 0.2)",
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: "#6366F1",
                        },
                        text: {
                          color: "#6366F1",
                          fontWeight: "bold",
                        },
                      },
                    },
                  }}
                  markingType="custom"
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
                <View
                  className={`p-4 rounded-xl mb-4 border ${
                    scheduleData[selectedDate]?.isAvailable
                      ? "bg-green-50 border-green-500"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="today"
                      size={24}
                      color={scheduleData[selectedDate]?.isAvailable ? "#4CAF50" : "#F44336"}
                    />
                    <Text className="text-base text-gray-800 font-semibold ml-3">{formatDate(selectedDate)}</Text>
                  </View>

                  {scheduleData[selectedDate]?.isAvailable ? (
                    <TouchableOpacity
                      className="bg-green-500 rounded-lg py-3 px-4 flex-row items-center justify-center mt-4 w-full"
                      onPress={handleDateConfirmation}
                    >
                      <Ionicons name="calendar-outline" size={18} color="#fff" />
                      <Text className="text-white font-semibold text-base ml-2">Book This Day</Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="bg-red-50 border border-red-500 rounded-lg py-3 px-4 flex-row items-center justify-center mt-4 w-full">
                      <Ionicons name="close-circle" size={18} color="#F44336" />
                      <Text className="text-red-600 font-semibold text-base ml-2">Booked</Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </Animated.View>

        <View className="h-24" />
      </ScrollView>

      {showConfirmation && selectedDate && (
        <Animated.View style={{ opacity: fadeAnim }} className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden shadow-2xl">
          <BlurView intensity={90} tint="light" className="rounded-t-3xl">
            <View className="p-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-800">Confirm Booking</Text>
                <TouchableOpacity className="w-9 h-9 rounded-full bg-gray-200/80 justify-center items-center" onPress={() => setShowConfirmation(false)}>
                  <Ionicons name="close" size={24} color="#6366F1" />
                </TouchableOpacity>
              </View>

              <View className="bg-gray-200/50 rounded-xl p-4 mb-5">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="person" size={20} color="#6366F1" />
                  <Text className="text-base text-gray-600 ml-2">
                    <Text className="font-semibold text-gray-800">Cleaner: </Text>
                    {cleaner.name}
                  </Text>
                </View>

                <View className="flex-row items-center mb-3">
                  <Ionicons name="calendar" size={20} color="#6366F1" />
                  <Text className="text-base text-gray-600 ml-2">
                    <Text className="font-semibold text-gray-800">Date: </Text>
                    {formatDate(selectedDate || "")}
                  </Text>
                </View>

                <View className="flex-row items-center mb-3">
                  <MaterialCommunityIcons name="broom" size={20} color="#6366F1" />
                  <Text className="text-base text-gray-600 ml-2">
                    <Text className="font-semibold text-gray-800">Service: </Text>
                    Full Day Cleaning (60 min)
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                className="bg-green-500 rounded-xl py-4 px-4 flex-row justify-center items-center mt-2"
                onPress={handleBookSlot}
                disabled={bookingInProgress}
              >
                {bookingInProgress ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text className="text-white text-base font-semibold ml-2">Confirm Booking</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
};

export default CleanerDetails;
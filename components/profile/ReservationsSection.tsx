import { AntDesign, Entypo, EvilIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteReservation, fetchReservationsClient } from '~/redux/slices/reservationsSlice';
import type { AppDispatch, RootState } from '~/redux/store';
interface Reservation {
  _id: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  cleaner: {
    name: string;
    location: string;
  };
}
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return { date: 'N/A', time: 'N/A' };
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
};

export default function ReservationsSection() {
  const { reservations } = useSelector((state: RootState) => state.reservations);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchReservationsClient());
  }, [dispatch, reservations.length]);

  const handleDeleteReservation = (reservationId: string) => () => {
    Alert.alert('Confirm Cancellation', 'Are you sure you want to cancel this reservation?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () =>
          dispatch(deleteReservation(reservationId)).then(() => {
            dispatch(fetchReservationsClient());
            Alert.alert('Success', 'Reservation canceled successfully!');
          }),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-neutral-50 p-5">
      <Text className="mb-6 text-2xl font-extrabold tracking-tight text-slate-900">
        Your Reservations
      </Text>

      {reservations?.length > 0 ? (
        reservations.map((reservation) => {
          const { date, time } = formatDate(reservation.date);
          const statusColors = {
            pending: { background: 'bg-amber-500', text: 'text-amber-50' },
            accepted: { background: 'bg-emerald-600', text: 'text-emerald-50' },
            rejected: {background:'bg-rose-600', text: 'text-rose-50' },
          };

          return (
            <View
              key={reservation._id}
              className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm shadow-black/10">
              {/* Status Header */}
              <View className={`${statusColors[reservation.status].background} px-5 py-3.5`}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-2.5">
                    <View
                      className={`h-2 w-2 rounded-full ${statusColors[reservation.status].text} bg-opacity-30`}
                    />
                    <Text
                      className={`${statusColors[reservation.status].text} text-sm font-semibold tracking-wide`}>
                      {reservation.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text className="text-xs font-medium text-white/90">{date}</Text>
                </View>
              </View>

              {/* Card Content */}
              <View className="space-y-4 p-5 gap-3">
                <View className="flex-row items-start justify-between">
                  <Text className="max-w-[70%] text-lg font-bold text-slate-900">
                    {reservation?.cleaner?.name}
                  </Text>
                  <View className="rounded-md bg-blue-100 px-3 py-1.5">
                    <Text className="text-sm font-bold text-blue-800">120 DH</Text>
                  </View>
                </View>

                <View className="gap-3  flex-row items-center space-x-3 ">
                  <View className="rounded-full bg-slate-100 p-2">
                  <AntDesign name="clockcircleo" size={24} color="black" />   
                    </View>
                  <Text className="font-medium text-slate-700">Start at: {time}</Text>
                </View>

                <View className="gap-3 flex-row items-center space-x-3">
                  <View className=" rounded-full bg-slate-100 p-2">
                    <EvilIcons name="location" size={24} color="black" />
                  </View>
                  <Text className="font-medium text-slate-700">
                    {reservation?.cleaner?.location}
                  </Text>
                </View>

                {reservation.status === 'pending' && (
                  <View className="flex-row gap-3 pt-4">
                    <TouchableOpacity
                      onPress={handleDeleteReservation(reservation._id)}
                      className="flex-1 active:opacity-70"
                      activeOpacity={0.8}>
                      <View className="items-center rounded-xl bg-rose-600 p-3">
                        <Text className="text-sm font-semibold text-white">Cancel Booking</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-lg font-medium text-slate-400">
            No upcoming reservations found
          </Text>
        </View>
      )}
    </View>
  );
}

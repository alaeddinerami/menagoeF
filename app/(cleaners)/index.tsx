import { useState, useRef, useEffect, memo } from 'react';
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import { fetchReservationsCleaner, updateReservation } from '~/redux/slices/reservationsSlice';

// Types
type Reservation = {
  _id: string;
  cleaner: string;
  client: { _id: string; name: string; image?: string };
  date: string;
  Duration: number;
  status: 'pending' | 'accepted' | 'rejected';
  note?: string;
  address: string;
  phone?: string;
  serviceType?: string;
};

type Tab = 'pending' | 'accepted' | 'rejected';

// Constants
const TABS: Tab[] = ['pending', 'accepted', 'rejected'];
const STATUS_CONFIG = {
  pending: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: 'time', iconColor: '#4f46e5' },
  accepted: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: 'checkmark-circle', iconColor: '#059669' },
  rejected: { bg: 'bg-rose-100', text: 'text-rose-700', icon: 'close-circle', iconColor: '#dc2626' },
} as const;

// Utility Functions
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const formatTimeRange = (date: string, duration: number) => {
  const start = new Date(date);
  const end = new Date(start.getTime() + duration * 60000);
  return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const getDateKey = (date: string) => new Date(date).toISOString().split('T')[0];

// Components
const ReservationCard = memo(
  ({
    item,
    expandedId,
    onToggle,
  }: {
    item: Reservation;
    expandedId: string | null;
    onToggle: (id: string) => void;
  }) => {
    const dispatch = useDispatch<AppDispatch>();
    const isExpanded = expandedId === item._id;
    const status = STATUS_CONFIG[item.status];
    const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
    const imageclient = item.client.image;
    const imageUrl = imageclient ? `${BASE_URL}/${imageclient}` : 'https://avatar.iran.liara.run/public';

    const handleAccept = () => {
      dispatch(updateReservation({ reservationId: item._id, status: 'accepted' }));
    };

    const handleReject = () => {
      dispatch(updateReservation({ reservationId: item._id, status: 'rejected' }));
    };

    return (
      <TouchableOpacity
        className={`mx-4 my-3 rounded-xl border bg-white shadow-md ${isExpanded ? 'border-indigo-200' : 'border-gray-200/50'}`}
        onPress={() => onToggle(item._id)}
        activeOpacity={0.85}
      >
        <View className="p-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center">
              <Image
                source={{ uri: imageUrl }}
                className="mr-4 h-12 w-12 rounded-full bg-gray-100"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">{item.client.name}</Text>
                <Text className="text-sm text-gray-600">{item.serviceType || 'Cleaning'}</Text>
              </View>
            </View>
            <View
              className={`flex-row items-center rounded-full px-3 py-1.5 ${status.bg} shadow-sm`}
            >
              <Ionicons name={status.icon} size={16} color={status.iconColor} />
              <Text className={`ml-1.5 text-sm font-medium ${status.text}`}>{item.status}</Text>
            </View>
          </View>

          <View className="mt-4 space-y-2">
            {[
              { icon: 'calendar', text: formatDate(item.date) },
              { icon: 'clock', text: formatTimeRange(item.date, item.Duration), lib: MaterialCommunityIcons },
              { icon: 'hourglass', text: formatDuration(item.Duration) },
              ...(item.address ? [{ icon: 'location', text: item.address }] : []),
            ].map(({ icon, text, lib: IconLib = Ionicons }, index) => (
              <View key={index} className="flex-row items-center">
                <IconLib name={icon} size={16} color="#6b7280" />
                <Text className="ml-3 flex-1 text-base text-gray-700" numberOfLines={1}>
                  {text}
                </Text>
              </View>
            ))}
          </View>

          {isExpanded && (
            <View className="mt-5 border-t border-gray-200/50 pt-4">
              {item.note && (
                <View className="mb-4">
                  <Text className="text-base font-medium text-gray-800">Note</Text>
                  <Text className="mt-2 text-base text-gray-600">{item.note}</Text>
                </View>
              )}
              <View className="flex-row flex-wrap gap-3">
                {item.phone && (
                  <TouchableOpacity
                    className="min-w-[120px] flex-1 flex-row items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 shadow-sm"
                    onPress={() => Linking.openURL(`tel:${item.phone}`)}
                  >
                    <Ionicons name="call" size={18} color="white" />
                    <Text className="ml-2 text-base font-medium text-white">Call</Text>
                  </TouchableOpacity>
                )}
                {item.address && (
                  <TouchableOpacity
                    className="min-w-[120px] flex-1 flex-row items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 shadow-sm"
                    onPress={() => {
                      const url = Platform.select({
                        ios: `maps:0,0?q=${encodeURIComponent(item.address)}`,
                        android: `geo:0,0?q=${encodeURIComponent(item.address)}`,
                      });
                      url && Linking.openURL(url);
                    }}
                  >
                    <Ionicons name="navigate" size={18} color="white" />
                    <Text className="ml-2 text-base font-medium text-white">Directions</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'pending' && (
                  <>
                    <TouchableOpacity
                      className="min-w-[120px] flex-1 flex-row items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 shadow-sm"
                      onPress={handleAccept}
                    >
                      <Ionicons name="checkmark" size={18} color="white" />
                      <Text className="ml-2 text-base font-medium text-white">Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="min-w-[120px] flex-1 flex-row items-center justify-center rounded-lg bg-rose-600 px-4 py-3 shadow-sm"
                      onPress={handleReject}
                    >
                      <Ionicons name="close" size={18} color="white" />
                      <Text className="ml-2 text-base font-medium text-white">Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }
);

const SectionHeader = memo(({ date }: { date: string }) => {
  const today = new Date();
  const formatted = new Date(date);
  const isToday = formatted.toDateString() === today.toDateString();
  const isTomorrow =
    formatted.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString();

  const title = isToday
    ? 'Today'
    : isTomorrow
      ? 'Tomorrow'
      : formatted.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <View className="border-b border-gray-200/50 bg-gray-50 px-4 py-1">
      <Text className="text-lg font-semibold text-gray-800">{title}</Text>
    </View>
  );
});

export default function ReservationsScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();
  const { reservations, loading, error } = useSelector((state: RootState) => state.reservations);

  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const tabAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchReservationsCleaner());
  }, [dispatch]);

  const handleTabChange = (tab: Tab) => {
    Animated.timing(tabAnim, {
      toValue: TABS.indexOf(tab),
      duration: 250,
      useNativeDriver: true,
    }).start(() => setActiveTab(tab));
  };

  const toggleCard = (id: string) => setExpandedCardId(expandedCardId === id ? null : id);

  const filteredReservations = () => {
    const query = searchQuery.toLowerCase().trim();
    return reservations
      .filter(
        (r) =>
          r.status === activeTab &&
          (!query ||
            r.client.name.toLowerCase().includes(query) ||
            r._id.toLowerCase().includes(query) ||
            r.address?.toLowerCase().includes(query))
      )
      .reduce(
        (acc, r) => {
          const key = getDateKey(r.date);
          acc[key] = acc[key] || [];
          acc[key].push(r);
          return acc;
        },
        {} as Record<string, Reservation[]>
      );
  };

  const groupedData = filteredReservations();
  const sortedDates = Object.keys(groupedData).sort();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />
      <Animated.View className="bg-indigo-600 px-5 py-4 shadow-lg">
        <Text className="text-2xl font-bold text-white">Reservations</Text>
        <Animated.View className="mt-3">
          <View className="flex-row items-center rounded-lg bg-indigo-500/90 px-3 py-1 shadow-sm">
            <Ionicons name="search" size={18} color="white" />
            <TextInput
              className="mx-3 flex-1 text-sm text-white placeholder:text-indigo-200"
              placeholder="Search by name, address, or service..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>
      </Animated.View>

      <View className="border-b border-gray-200 bg-white py-3 shadow-sm">
        <View className="flex-row justify-around px-5">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              className="relative px-5 py-2"
              onPress={() => handleTabChange(tab)}
            >
              <Text
                className={`text-base font-medium capitalize ${activeTab === tab ? 'text-indigo-600' : 'text-gray-600'}`}
              >
                {tab}
              </Text>
              {activeTab === tab && (
                <View className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-indigo-600" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.FlatList
        data={sortedDates}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => (
          <>
            <SectionHeader date={date} />
            {groupedData[date].map((reservation) => (
              <ReservationCard
                key={reservation._id}
                item={reservation}
                expandedId={expandedCardId}
                onToggle={toggleCard}
              />
            ))}
          </>
        )}
        contentContainerClassName="pb-20"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              dispatch(fetchReservationsCleaner()).then(() => setRefreshing(false));
            }}
            tintColor="#4f46e5"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="calendar" size={48} color="#9ca3af" />
            <Text className="mt-3 text-base text-gray-500">No {activeTab} reservations found</Text>
            {searchQuery && (
              <TouchableOpacity
                className="mt-4 rounded-lg bg-indigo-100 px-4 py-2 shadow-sm"
                onPress={() => setSearchQuery('')}
              >
                <Text className="text-base font-medium text-indigo-600">Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListHeaderComponent={
          loading && (
            <View className="items-center py-5">
              <Text className="text-base text-gray-500">Loading reservations...</Text>
            </View>
          )
        }
        ListFooterComponent={
          error && (
            <View className="items-center py-5">
              <Text className="text-base text-red-500">Error: {error}</Text>
              <TouchableOpacity
                className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 shadow-sm"
                onPress={() => dispatch(fetchReservationsCleaner())}
              >
                <Text className="text-base font-medium text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          )
        }
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/redux/store";
import { fetchCleaners } from "~/redux/slices/cleanersSlice";
import { CleanerCard } from "~/components/admin/CleanerCard";
import { AddCleanerModal } from "~/components/admin/AddCleanerModal";
import AntDesign from '@expo/vector-icons/AntDesign';

interface Cleaner {
  _id: string;
  name: string;
  location: string;
  phone: string;
  image?: string | null;
}

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchCleaners());
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchCleaners()).finally(() => setRefreshing(false));
  }, [dispatch]);

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-10">
      <Text className="text-gray-500 text-lg font-medium">
        No cleaners available
      </Text>
      <TouchableOpacity
        className="mt-4 bg-indigo-600 rounded-lg py-2 px-6"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-semibold">Add a Cleaner</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center px-5 py-4 bg-white shadow-md">
        <Text className="text-2xl font-bold text-indigo-700">
          Available Cleaners
        </Text>
        <TouchableOpacity
          className="bg-indigo-600 rounded-xl py-2 px-4 shadow-sm"
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="adduser" size={24} color="black" />        </TouchableOpacity>
      </View>

      {loading && !refreshing && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text className="mt-2 text-gray-600">Loading cleaners...</Text>
        </View>
      )}

      {error && !loading && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-lg font-medium">{error}</Text>
          <TouchableOpacity
            className="mt-4 bg-indigo-600 rounded-lg py-2 px-6"
            onPress={() => dispatch(fetchCleaners())}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
        style={{ paddingTop: 8 }}
          data={cleaners}
          keyExtractor={(item: Cleaner) => item._id}
          renderItem={({ item }) => <CleanerCard cleaner={item} />}
          contentContainerStyle={{ paddingHorizontal: 5, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4f46e5"]}
              tintColor="#4f46e5"
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddCleanerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default Index;
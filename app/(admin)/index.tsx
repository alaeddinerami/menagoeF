import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "~/redux/store";
import { fetchCleaners } from "~/redux/slices/cleanersSlice";
import { CleanerCard } from "~/components/admin/CleanerCard";
import { AddCleanerModal } from "~/components/admin/AddCleanerModal"; // Adjust path

const Index = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCleaners());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-gray-100 pt-10">
      <View className="flex-row justify-between items-center px-4 mb-4">
        <Text className="text-2xl font-bold text-indigo-600">
          Available Cleaners
        </Text>
        <TouchableOpacity
          className="bg-indigo-600 rounded-lg py-2 px-4"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-semibold">Add Cleaner</Text>
        </TouchableOpacity>
      </View>

      {loading && <Text className="text-center text-gray-500">Loading...</Text>}
      {error && <Text className="text-center text-red-500">{error}</Text>}

      <FlatList
        data={cleaners}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CleanerCard cleaner={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <AddCleanerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default Index;
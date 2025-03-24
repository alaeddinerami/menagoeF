import { AntDesign } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { UpdateCleanerModal } from './UpdateCleanerModal';
import { useState } from 'react';
import { AppDispatch, RootState } from '~/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCleaner, fetchCleaners } from '~/redux/slices/cleanersSlice';

interface Cleaner {
  _id: string;
  name: string;
  location: string;
  phone: string;
  image?: string;
}

export const CleanerCard = ({ cleaner }: { cleaner: any }) => {
  const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const cleanerImage = cleaner.image
    ? `${BASE_URL}/${cleaner.image}`
    : 'https://avatar.iran.liara.run/public';

  //   console.log('clenar image:', cleanerImage);

  const [modalVisible, setModalVisible]= useState(false)
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.cleaners);

  const handelDeleteCleaner = (id:string) => {
    dispatch(deleteCleaner(id)).then(()=>{
      dispatch(fetchCleaners())
    });
  }

  return (
    <>
    <TouchableOpacity className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-md">
      <View className="flex-row items-center gap-4 space-x-4">
        <Image source={{ uri: cleanerImage }} className="h-16 w-16 rounded-full" />
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{cleaner.name}</Text>
          <Text className="text-sm text-gray-600">{cleaner.location}</Text>
          <Text className="text-sm text-gray-500">{cleaner.phone}</Text>
        </View>
        <View className='flex-row gap-3'>
          <TouchableOpacity onPress={() => handelDeleteCleaner(cleaner._id)}>
            <AntDesign name="delete" size={24} color="red" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <AntDesign name="edit" size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
    <UpdateCleanerModal 
    visible={modalVisible} 
    onClose={() => setModalVisible(false)}
    cleaner={cleaner}
    />
     
    </>
  );
};

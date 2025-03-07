// app/cleanerDetails/[id].tsx
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import useRouter for navigation
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import { fetchCleaners } from '~/redux/slices/cleanersSlice';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const CleanerDetails = () => {
  const { id } = useLocalSearchParams(); 
  const dispatch = useDispatch<AppDispatch>();
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners);
  const router = useRouter(); 

  useEffect(() => {
    if (!cleaners.length) {
      dispatch(fetchCleaners()); 
    }
  }, [dispatch]);

  const cleaner = cleaners.find((c) => c._id === id);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!cleaner) {
    return (
      <View style={styles.container}>
        <Text>Cleaner not found</Text>
      </View>
    );
  }

  const imageUrl = cleaner.image ? `${BASE_URL}/${cleaner.image}` : null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cleaner Details</Text>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={(e) => console.log('Image error:', e.nativeEvent.error)}
        />
      ) : (
        <Text>No Image</Text>
      )}
      <Text style={styles.text}>Name: {cleaner.name}</Text>
      <Text style={styles.text}>Email: {cleaner.email}</Text>
      <Text style={styles.text}>Location: {cleaner.location}</Text>
      <Text style={styles.text}>Phone: {cleaner.phone}</Text>
      <Button title="Back" onPress={() => router.back()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginVertical: 4,
  },
});

export default CleanerDetails;
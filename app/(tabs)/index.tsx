// src/screens/CleanersScreen.tsx
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '~/redux/slices/authSlice';
import { fetchCleaners } from '~/redux/slices/cleanersSlice';
import { AppDispatch, RootState } from '~/redux/store';

const CleanersScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cleaners, loading, error } = useSelector((state: RootState) => state.cleaners);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        dispatch(fetchCleaners());
      }
    }, [dispatch, isAuthenticated])
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view cleaners.</Text>
      </View>
    );
  }

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
        <Button title="Retry" onPress={() => dispatch(fetchCleaners())} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {user?.user?.name}!</Text>
      <Button title="Logout" onPress={handleLogout} />
      <FlatList
        data={cleaners}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          // const imagePath = `http://192.168.9.91:3000/${item.image}`;
          const imagePath = `${process.env.EXPO_PUBLIC_API_URL}/${item.image}`;
          // console.log(imagePath);

          return (
            <TouchableOpacity style={styles.cleanerCard}
            onPress={() => router.push(`/cleanerDetails/${item._id}` as any)}
            >        
              {item.image ? (
                <Image
                  source={{ uri: imagePath }} // Adjust base URL
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <Text>No Image</Text>
              )}

              <Text style={styles.text}>Name: {item.name}</Text>
              <Text style={styles.text}>Email: {item.email}</Text>
              <Text style={styles.text}>Location: {item.location}</Text>
              <Text style={styles.text}>Phone: {item.phone}</Text>
            </TouchableOpacity>
          );
        }}
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cleanerCard: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
});

export default CleanersScreen;

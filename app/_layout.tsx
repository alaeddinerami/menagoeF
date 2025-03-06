import { Provider, useDispatch, useSelector } from 'react-redux';
import '../global.css';

import { Slot, Stack } from 'expo-router';
import store, { AppDispatch, persistor, RootState } from '~/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useEffect } from 'react';
import { checkAuth } from '~/redux/slices/authSlice';






export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

function AppInitializer() {
  const { loading} = useSelector((state: RootState) => state.auth);

if(loading) {
return <ActivityIndicator color={'blue'} size={'large'} />
}

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<View><Text>Loading redux</Text></View>} persistor={persistor}>
        {/* <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack> */}
        <AppInitializer />
      </PersistGate>
    </Provider>
  );
}

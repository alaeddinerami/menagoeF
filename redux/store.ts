import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer, { checkAuth } from "./slices/authSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// Function to check token and return initial auth state
const initializeAuthState = async () => {

  console.log('initializing auth state');
  try {
    // const token = await AsyncStorage.getItem("authToken");
    // return !!token;
    store.dispatch(checkAuth());
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};

// Configure store
const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});


initializeAuthState()
// Export types and persistor
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
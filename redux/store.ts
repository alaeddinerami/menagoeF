import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer, { checkAuth } from "./slices/authSlice";
import cleanersReducer from "./slices/cleanersSlice";
import reservationsReducer from "./slices/reservationsSlice";
// import chatReducer from "./slices/chatSlice";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const initializeAuthState = async () => {

  // console.log('initializing auth state');
  try {
    // const token = await AsyncStorage.getItem("authToken");
    // return !!token;
    store.dispatch(checkAuth());
  } catch (error) {
    console.error("Error checking token:", error);
    return false;
  }
};

const store = configureStore({
  reducer: {
    auth: persistedReducer,
    cleaners: cleanersReducer,
    reservations: reservationsReducer,
    // chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["chat.socket"],
      },
    }),
});


initializeAuthState()
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
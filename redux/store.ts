import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
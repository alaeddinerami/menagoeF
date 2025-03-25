import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InnerUser {
  name?: string;
  email: string;
  _id: string; 
  roles: string[];
  location: string;
  phone: string;
}

interface User {
  token: string;
  user: InnerUser;
}

interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  token: null,
  isAuthenticated: false,
};

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // console.log('checking auth in dlice');
      const token = await AsyncStorage.getItem("authToken");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null
      // console.log(token);
      if (!token ) return null;
      return { token, user};     
    } catch (error: any) {
      await AsyncStorage.removeItem("authToken"); 
      return rejectWithValue("Invalid or expired token");
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/signUp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { token, user } = response.data;
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify({ user }));
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, ...userData } = response.data;
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return { token, ...userData };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      AsyncStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.token = action.payload?.token;
        state.user = action.payload?.user;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
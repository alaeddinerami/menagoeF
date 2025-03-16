import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../api/axiosInstance"; 
import { RootState } from "../store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface OtherUser {
  id: string;
  name: string;
  image: string;
}

export interface Chat {
  chatId: string;
  otherUser: OtherUser;
  lastMessage: string | null;
  updatedAt: string | Date;
}

// Define the ChatListState type
interface ChatListState {
  chats: Chat[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ChatListState = {
  chats: [],
  loading: false,
  error: null,
};

// Async thunk to fetch user's chat list
export const fetchUserChats = createAsyncThunk(
  "chatList/fetchUserChats",
  async (userId: string, { getState, rejectWithValue }) => {
    try {
        const token = await AsyncStorage.getItem("authToken");
        const userString = await AsyncStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null
      const userId = user.user._id;

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await apiClient.get(`/chat/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('chat',response.data);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user chats"
      );
    }
  }
);

const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    addChat(state, action: PayloadAction<Chat>) {
      state.chats.push(action.payload);
      // Sort chats by updatedAt descending
      state.chats.sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
      );
    },
    clearChats(state) {
      state.chats = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload; 
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addChat, clearChats } = chatListSlice.actions;

export default chatListSlice.reducer;
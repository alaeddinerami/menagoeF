import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../api/axiosInstance"; // Your Axios instance
import { RootState } from "../store";

export interface Message {
  _id?: string; 
  senderId: string;
  content: string;
  isRead: boolean;
  timestamp: string | Date; 
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (
    { userId, otherUserId }: { userId: string; otherUserId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await apiClient.get(`/chat/messages/${userId}/${otherUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch chat history");
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  "chat/sendChatMessage",
  async (
    
    { senderId, receiverId, content }: { senderId: string; receiverId: string; content: string },
    { getState, rejectWithValue }
  ) => {
    try {
      console.log('sending message',senderId,receiverId,content);
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await apiClient.post(
        "/chat/message",
        { senderId, receiverId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

export const markChatMessageAsRead = createAsyncThunk(
  "chat/markChatMessageAsRead",
  async (messageId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await apiClient.patch(
        `/chat/message/${messageId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark message as read");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(markChatMessageAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markChatMessageAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const updatedMessage = action.payload;
        const index = state.messages.findIndex((msg) => msg._id === updatedMessage._id);
        if (index !== -1) {
          state.messages[index] = updatedMessage; 
        }
      })
      .addCase(markChatMessageAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;
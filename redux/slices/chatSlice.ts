import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../api/axiosInstance"; // Your Axios instance
import { RootState } from "../store";
import { NewMsg } from "~/app/_layout";

// Define the Message type based on your Message entity
export interface Message {
  _id?: string; // MongoDB ID
  senderId: string;
  content: string;
  isRead: boolean;
  timestamp: string | Date; // Can be Date or ISO string
}

// Define the ChatState type
interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

// Initial state
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

// Async thunk to send a message (POST /chat/message)
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

// Async thunk to mark a message as read (PATCH /chat/message/:messageId/read)
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

// Create the chat slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<NewMsg>) {
      console.log('payload message',action.payload);

      const newMessage: Message = {
        senderId: action.payload.senderId,
        content: action.payload.message,
        isRead: false,
        timestamp: new Date().toISOString()
      };
      state.messages.push(newMessage);
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Chat History
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

    // Send Message
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload); // Add the new message to the state
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Mark Message as Read
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
          state.messages[index] = updatedMessage; // Update the message in the state
        }
      })
      .addCase(markChatMessageAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { addMessage, clearMessages } = chatSlice.actions;

// Export reducer
export default chatSlice.reducer;
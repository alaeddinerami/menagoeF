import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
}

interface ChatState {
  socket: Socket | null;
  messages: Message[];
  connected: boolean;
  error: string | null;
}

const initialState: ChatState = {
  socket: null,
  messages: [],
  connected: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    initializeSocket(state, action: PayloadAction<string>) {
      if (state.socket?.connected) {
        console.log("Socket already connected");
        return;
      }

      const token = action.payload;
      const socket = io(SOCKET_URL, {
        autoConnect: false,
        auth: { token },
      });

      state.socket = socket;

      socket.on("connect", () => {
        state.connected = true;
        state.error = null;
        console.log("WebSocket connected successfully");
      });

      socket.on("disconnect", () => {
        state.connected = false;
        console.log("WebSocket disconnected");
      });

      socket.on("connect_error", (err: Error) => {
        console.error("WebSocket connection error:", err.message);
        state.error = err.message;
        state.connected = false;
      });

      socket.on("message", (msg: Message) => {
        state.messages.push(msg);
        console.log("Received message:", msg);
      });

      socket.on("chatHistory", (history: Message[]) => {
        state.messages = [...history];
        console.log("Received chat history:", history);
      });

      socket.on("error", (err: { message: string }) => {
        console.error("Server error:", err.message);
        state.error = err.message;
      });

      socket.connect();
    },

    disconnectSocket(state) {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
        state.connected = false;
        state.messages = [];
        state.error = null;
      }
    },

    joinChat(state, action: PayloadAction<string>) {
      if (state.socket && state.connected) {
        state.socket.emit("joinChat", { chatId: action.payload });
      } else {
        console.warn("Cannot join chat: socket not connected");
      }
    },

    sendMessage(state, action: PayloadAction<{ receiverId: string; content: string }>) {
      if (state.socket && state.connected) {
        const message = {
          ...action.payload,
          senderId: state.socket.id || "", // Add senderId
          id: Date.now().toString(), // Temporary ID
          isRead: false,
        };
        state.socket.emit("message", message);
        state.messages.push(message); // Optimistic update
      } else {
        console.warn("Cannot send message: socket not connected");
      }
    },

    clearMessages(state) {
      state.messages = [];
    },

    // Additional useful reducers
    updateMessageStatus(state, action: PayloadAction<{ messageId: string; isRead: boolean }>) {
      const message = state.messages.find(m => m.id === action.payload.messageId);
      if (message) {
        message.isRead = action.payload.isRead;
      }
    },
  },
});

// Export actions
export const { 
  initializeSocket, 
  disconnectSocket, 
  joinChat, 
  sendMessage, 
  clearMessages,
  updateMessageStatus 
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectChatState = (state: { chat: ChatState }) => state.chat;
export const selectMessages = (state: { chat: ChatState }) => state.chat.messages;
export const selectConnectionStatus = (state: { chat: ChatState }) => state.chat.connected;
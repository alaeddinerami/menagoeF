import { Provider, useSelector, useDispatch } from "react-redux";
import "../global.css";
import { Slot } from "expo-router";
import store, { persistor, RootState } from "~/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { initializeSocket, getSocket } from "~/utils/socket";
import { addMessage, clearMessages } from "~/redux/slices/chatSlice";

export interface NewMsg {
  message: string;
  senderId: string;
}

export const unstable_settings = {
  initialRouteName: "index",
};

function AppInitializer() {
  const dispatch = useDispatch();
  const { loading, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const userId = useSelector((state: RootState) => state.auth.user?.user?._id);
  const socketRef = useRef<any>(null); 

  useEffect(() => {
    if (token && isAuthenticated && userId) {
      const socket = initializeSocket(token);
      socketRef.current = socket;

      // Ensure socket is connected
      if (!socket.connected) {
        socket.connect();
      }

      // Define event handler
      const handleMessageReceived = (newMsg: NewMsg) => {
        console.log("Received message:", newMsg);
        dispatch(addMessage(newMsg));
      };

      // Clean up previous listeners and add new one
      socket.off(`message_received-${userId}`); 
      socket.on(`message_received-${userId}`, handleMessageReceived);

      socket.on("connect", () => {
        console.log("WebSocket connected successfully");
      });

      socket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });

      socket.on("connect_error", (err: Error) => {
        console.error("WebSocket connection error:", err.message);
      });

      socket.on("chatHistory", (history: any[]) => {
        console.log("Received chat history:", history);
      });

      socket.on("error", (err: { message: string }) => {
        console.error("Server error:", err.message);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.off(`message_received-${userId}`, handleMessageReceived); // Remove specific listener
          socketRef.current.disconnect();
        }
        dispatch(clearMessages());
      };
    }
  }, [token, isAuthenticated, userId, dispatch]); 

  if (loading) {
    return <ActivityIndicator color={"blue"} size={"large"} />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={<View><Text>Loading redux</Text></View>} persistor={persistor}>
        <AppInitializer />
      </PersistGate>
    </Provider>
  );
}
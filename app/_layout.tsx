import { Provider, useSelector, useDispatch } from "react-redux";
import "../global.css";
import { Slot } from "expo-router";
import store, { persistor, RootState } from "~/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, Text, View } from "react-native";
import { useEffect } from "react";
import { initializeSocket } from "~/utils/socket";
import { addMessage, clearMessages } from "~/redux/slices/chatSlice";

export const unstable_settings = {
  initialRouteName: "index",
};

function AppInitializer() {
  const dispatch = useDispatch();
  const { loading, token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const userId = useSelector((state: RootState) => state.auth.user?.user?._id);

  useEffect(() => {
    let socket: any;

    if (token && isAuthenticated) {
      socket = initializeSocket(token);

      socket.on("connect", () => {
        console.log("WebSocket connected successfully");
      });

      socket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });

      socket.on("connect_error", (err: Error) => {
        console.error("WebSocket connection error:", err.message);
      });

      socket.on("message", (msg: message) => {
        console.log("Received message:", msg);
        dispatch(addMessage(msg)); 
        // Add all messages; ChatScreen will filter via fetchChatHistory
      });

      socket.on("chatHistory", (history: message[]) => {
        console.log("Received chat history:", history);
      });

      socket.on("error", (err: { message: string }) => {
        console.error("Server error:", err.message);
      });

      socket.connect();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
      dispatch(clearMessages()); 
    };
  }, [token, isAuthenticated, dispatch]);

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
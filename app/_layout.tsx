import { Provider, useSelector } from "react-redux";
import "../global.css";
import { Slot } from "expo-router";
import store, { persistor, RootState } from "~/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator, Text, View } from "react-native";
import { useEffect } from "react";
import { initializeSocket } from "~/utils/socket"; // Import your socket factory function

export const unstable_settings = {
  initialRouteName: "index",
}
function AppInitializer() {
  const { loading, token ,isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let socket: any;

    if (token && isAuthenticated) {
      socket = initializeSocket(token);

      // Socket event listeners
      socket.on("connect", () => {
        console.log("WebSocket connected successfully");
      });

      socket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });

      socket.on("connect_error", (err: Error) => {
        console.error("WebSocket connection error:", err.message);
      });

      socket.on("message", (msg: any) => {
        console.log("Received message:", msg);
      });

      socket.on("chatHistory", (history: any[]) => {
        console.log("Received chat history:", history);
      });

      socket.on("error", (err: { message: string }) => {
        console.error("Server error:", err.message);
      });

      // Connect the socket
      socket.connect();
    }

    // Cleanup: Disconnect socket when token changes or component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [token,isAuthenticated]); 

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
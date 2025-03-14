import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL ;

let socket: Socket | null = null;

export const initializeSocket = (token?: string): Socket => {
  if (socket && socket.connected) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false,
    auth: token ? { token } : {},
  });

  return socket;
};

export default initializeSocket;
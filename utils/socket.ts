
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL;

let socket: Socket | null = null;

export const initializeSocket = (token?: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: false,
      auth: token ? { token } : {},
    });
  } else if (token && socket.auth.token !== token) {
    socket.disconnect();
    socket.auth = { token };
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

export default initializeSocket;
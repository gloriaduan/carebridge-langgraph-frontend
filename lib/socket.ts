import { io } from "socket.io-client";

export const socket = io("https://carebridge-langgraph-backend.fly.dev");
// export const socket = io("http://127.0.0.1:8000");

import { io } from "socket.io-client";

export const socket = io(
  "https://carebridge-backend-service-359543036179.us-central1.run.app"
);

// export const socket = io("http://127.0.0.1:8000");

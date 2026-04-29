import { io } from "socket.io-client";

export const socket = io("https://jobs-processing-backend.onrender.com",{
    withCredentials : true
});

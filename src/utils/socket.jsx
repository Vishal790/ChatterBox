import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem("token") },
    });

    return newSocket;

  
    return () => {
      newSocket.disconnect();
    };
    
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

// import React, { createContext, useContext, useEffect, useMemo } from "react";
// import { io } from "socket.io-client";

// const SocketContext = createContext();

// export const getSocket = () => useContext(SocketContext);

// const SocketProvider = ({ children }) => {
//   const socket = useMemo(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("No token found in localStorage.");
//       return null;
//     }

//     const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
//       withCredentials: true,
//       auth: { token: token },
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 1000,
//       reconnectionDelayMax: 5000,
//       timeout: 20000,
//     });

//     newSocket.on("connect", () => {
//       console.log("Connected to socket server");
//     });

//     newSocket.on("disconnect", (reason) => {
//       console.log("Disconnected from socket server:", reason);
//     });

//     newSocket.on("connect_error", (error) => {
//       console.log("Connection error:", error.message);
//     });

//     return newSocket;
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, [socket]);

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

// export default SocketProvider;

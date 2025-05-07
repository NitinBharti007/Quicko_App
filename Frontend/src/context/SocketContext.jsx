import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;

    // Initialize socket connection
    const socketInstance = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080', {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: maxRetries,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      forceNew: true
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
      retryCount = 0;

      // Join appropriate room based on user role
      if (user?.role === 'ADMIN') {
        socketInstance.emit('joinAdminRoom');
      }
      if (user?._id) {
        socketInstance.emit('joinUserRoom', user._id);
      }
    });

    // Handle room join acknowledgment
    socketInstance.on('roomJoined', (data) => {
      console.log(`Successfully joined room: ${data.room}`);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setIsConnected(false);
      retryCount++;

      if (retryCount >= maxRetries) {
        toast.error('Unable to connect to server. Please refresh the page.');
      } else {
        toast.error(`Connection error: ${error.message}. Retrying... (${retryCount}/${maxRetries})`);
      }
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);

      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        socketInstance.connect();
      }
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.off('connect');
        socketInstance.off('connect_error');
        socketInstance.off('disconnect');
        socketInstance.off('roomJoined');
        socketInstance.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}; 
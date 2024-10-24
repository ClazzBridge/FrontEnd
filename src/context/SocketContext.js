import React, { createContext, useContext, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const websocketUrl = "http://localhost:3001";

// Context 생성
const SocketContext = createContext();

// Provider 컴포넌트
export const SocketProvider = ({children, isLoggedIn}) => {
  console.log("socket provider called");
  const socket = useRef(null);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');

      socket.current = io(websocketUrl);
      socket.current.emit('connected', token);
      console.log('WebSocket connected');

      socket.current.on('initError', errorMessage => {
        console.error(errorMessage);
      });

      socket.current.on('initCompleted', () => {
        console.log("socket init complete")
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          console.log('WebSocket disconnected');
        }
      };
    }
  }, [isLoggedIn]);

  return (
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
  );
};

// SocketContext를 사용하는 커스텀 훅
export const useSocket = () => {
  return useContext(SocketContext);
};
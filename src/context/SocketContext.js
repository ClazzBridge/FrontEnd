import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setConnected, setDisconnected } from "../redux/socketSlice";
import React, { createContext, useContext, useEffect, useRef } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const socketRef = useRef(null);

  const initializeSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_SOCKET_SERVER_URI, {
        autoConnect: false,
        auth: {
          token: token,
          user: user,
        },
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected, id is :", socketRef.current.id);
        emitWithReconnect("register", {userId : user.id, token : token});
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketRef.current.on("initError", (errorMessage) => {
        console.error("Init error:", errorMessage);
      });

      socketRef.current.on("initCompleted", () => {
        console.log("Init completed");
      });

    }
  };

  const connectSocket = () => {
    console.log("connect!!!")
    socketRef.current.connect();
  };

  const disconnectSocket = () => {
    console.log("disconnect!!!")
    socketRef.current.disconnect();
  };


  // emitWithReconnect: 연결 상태 확인 후 명령 실행
  const emitWithReconnect = async (event, data) => {
    if (!socketRef.current.connected) {
      console.log("Socket not connected. Attempting to reconnect...");
      connectSocket();
      await new Promise((resolve) =>
          socketRef.current.once("connect", resolve) // 연결될 때까지 대기
      );
    }

    const payload = { ...data, token: token};

    // 연결 후 명령 실행
    socketRef.current.emit(event, payload);
    console.log(`Event emitted: ${event}`, payload);
  };

  // onEvent: 이벤트 리스너 추가
  const onEvent = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
      console.log(`Event listener added for: ${event}`);
    }
  };

  // offEvent: 이벤트 리스너 제거
  const offEvent = (event) => {
    if (socketRef.current) {
      socketRef.current.off(event);
      console.log(`Event listener removed for: ${event}`);
    }
  };

  useEffect(() => {
    initializeSocket();
    console.log(isLoggedIn, socketRef.current.connected);

    if (isLoggedIn && !socketRef.current.connected) {
      connectSocket();
    } else if (!isLoggedIn && socketRef.current.connected) {
      disconnectSocket();
    }

    return () => {
      disconnectSocket(); // 컴포넌트 언마운트 시 소켓 연결 해제
    };
  }, [isLoggedIn]);

  return (
      <SocketContext.Provider
          value={{
            socket: socketRef.current,
            emitWithReconnect,
            onEvent,
            offEvent,
          }}
      >
        {children}
      </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
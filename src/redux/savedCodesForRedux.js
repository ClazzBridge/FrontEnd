import { useSelector, useDispatch } from "react-redux";
import { login, logout, setSocket } from "./authSlice";
import { io } from "socket.io-client";
import {useEffect} from "react";

// redux 상태 읽기 코드
export const UserInfo = () => {
  const { isLoggedIn, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
      <div>
        {isLoggedIn ? (
            <div>
              <p>Logged in as: {user.name}</p>
              <p>Token: {token}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <p>Not logged in</p>
        )}
      </div>
  );
};

// redux 상태 변경 코드
export const LoginButton = () => {
  const dispatch = useDispatch();

  const handleLogin = (user, token) => {
    console.log("Logging in...");
    console.log("User:", user);
    console.log("Token:", token);

    dispatch(login({ user: user, token: token }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
      <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
  );
};

// 소켓 저장 및 관리 코드
export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("http://localhost:3000");
    dispatch(setSocket(socket));

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};

export default useSocket;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // auth slice import
import socketReducer from "./socketSlice"; // socket slice import
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isLoggedIn", "user", "token"],
};

const socketPersistConfig = {
  key : "socket",
  storage,
  whitelist: ["isConnected"],
};

const persistAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistSocketReducer = persistReducer(socketPersistConfig, socketReducer)

const store = configureStore({
  reducer: {
    auth: persistAuthReducer, // 로그인 상태, 사용자 정보 관리
    socket: persistSocketReducer, // 소켓 연결 상태 관리
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // 소켓 객체와 같은 비직렬화 데이터 허용
      }),
});

export const persistor = persistStore(store);
export default store;
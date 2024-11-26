import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  user: JSON.parse(localStorage.getItem("userInfo")) || {
    id: null,
    name: null,
  },
  token: localStorage.getItem("token") || null,
  isValid: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isValid = isTokenValid(state.token);

      // Save to localStorage
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = { id: null, name: null };
      state.token = null;
      state.isValid = false;

      // Remove from localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      localStorage.removeItem("seatInfo");
      Cookies.remove("refreshToken");
    },
    updateUserInfo(state, action) {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    updateUserState(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.isValid = isTokenValid(state.token);
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("isLoggedIn", action.payload.isLoggedIn);
    },
  },
});

export const isTokenValid = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);

    return exp > Date.now() / 1000;
  } catch (error) {
    console.error("Token is invalid:", error);
    return false;
  }
};

export const { login, logout, setSocket, updateUserInfo, updateUserState } =
  authSlice.actions;

export default authSlice.reducer;

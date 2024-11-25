import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {CustomLoginForm} from "./CustomLoginForm";
import {useSelector} from "react-redux";
import Router from "../../shared/Router";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {
  isTokenValid,
  updateUserState
} from "../../redux/authSlice";
import {useDispatch} from "react-redux";
import axios from "axios";
import {logoutAsync} from "../../redux/authActions";
import {debugLog} from "../../shared/debugLog";

function Login() {
  const { isLoggedIn, user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {

      if (isLoggedIn) {
        const refreshToken = Cookies.get("refreshToken");

        if (token && isTokenValid(token)) {
          dispatch(
              updateUserState({user: user, token: token, isLoggedIn: true}));
        } else if (refreshToken && isTokenValid(refreshToken)) {
          try {
            const response = await axios.post(
                process.env.REACT_APP_BACKEND_SERVER_URI + "auth/refresh",
                {
                  value: refreshToken,
                },
                {
                  withCredentials: true,
                }
            );
            dispatch(updateUserState({
              user: user,
              token: response.data.accessToken,
              isLoggedIn: true
            }))
          } catch (error) {
            console.error("Refresh token failed:", error);
            dispatch(logoutAsync());
          }
        } else {
          dispatch(logoutAsync());
        }
      }
    };

    checkToken();
  }, [navigate]);

  return (
      <Box>
        {isLoggedIn ? (
            <Router/>
        ) : (
            <CustomLoginForm />
        )}
      </Box>
  );
}

export default Login;

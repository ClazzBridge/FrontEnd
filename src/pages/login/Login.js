import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Router from "../../shared/Router";
import Grid from "@mui/material/Grid2";
import HomeImage from "../../assets/images/homeImage6.jpeg";
import backImage from "../../assets/images/photo_01_satur_-60.jpg";

function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      const refreshToken = Cookies.get("refreshToken");

      if (token && isTokenValid(token)) {
        setIsLoggedIn(true);
      } else if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/auth/refresh",
            {
              value: refreshToken,
            },
            {
              withCredentials: true,
            }
          );
          localStorage.setItem("token", response.data.accessToken);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Refresh token failed:", error);
          handleLogout();
          navigate("/"); // 로그인 페이지로 리다이렉트
        }
      } else {
        navigate("/"); // 로그인 페이지로 리다이렉트
      }
    };

    checkToken();
    setIsLoading(false);
  }, [navigate]);

  const isTokenValid = (token) => {
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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    console.log("=================logout");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    Cookies.remove("refreshToken");
    navigate("/login"); // 로그인 페이지로 리다이렉트
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>; // 로딩 중 메시지
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      {isLoggedIn ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
          }}
        >
          <Router></Router>
        </Box>
      ) : (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            // backgroundColor: "#34495e",
            // backgroundColor: "#f4f4f4",
            backgroundImage: `url(${backImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Box
            sx={{
              height: "100%",
              white: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 1,
            }}
          ></Box>
          <Box
            container
            spacing={0}
            sx={{
              borderRadius: "14px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
              display: "flex",
              width: "65%",
              height: "80%",
              zIndex: 2,
            }}
          >
            <Grid
              sx={{
                width: "50%",
                borderRight: "1px solid #f4f4f4",
                backgroundColor: "white",
                borderRadius: "14px 0 0 14px",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "14px 0 0 14px",
                  backgroundImage: `url(${HomeImage})`,
                  backgroundSize: "contain", // 이미지 크기 조정
                  backgroundPosition: "center", // 이미지 위치 조정
                  backgroundRepeat: "no-repeat", // 이미지 반복 방지
                }}
              />
            </Grid>
            <Grid
              sx={{
                width: "50%",
                backgroundColor: "white",
                borderRadius: "0 14px 14px 0",
              }}
            >
              <Box
                sx={{
                  margin: "24px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "center",
                  borderRadius: "0 14px 14px 0",
                }}
              >
                <Typography
                  align="center"
                  sx={{
                    padding: "12px",
                    fontWeight: 800,
                    position: "relative",
                    top: 140,
                    fontSize: "38px",
                    webkitBackgroundClip: "text",
                    webkitTextFillColor: "transparent",
                    color: "#34495e",
                  }}
                >
                  ClazzBridge
                </Typography>
              </Box>
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Login;

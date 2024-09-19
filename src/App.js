import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import { Box, Typography, Container } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Router from "./shared/Router";

function App() {
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
          const response = await axios.post("http://127.0.0.1:8080/api/auth/refresh", {
            value: refreshToken
          }, {
            withCredentials: true
          });
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
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
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
    console.log("=================logout")
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
      {
        isLoggedIn ? (
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
            <Router>

            </Router>
          </Box>
        ) :
          <Container maxWidth="xs">
            <Typography
              variant="h3"
              component="h1"
              align="center"
              gutterBottom
              sx={{ color: "Red", mb: 4 }}
            >
              아 집에 가고 싶다!
            </Typography>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </Container>
      }
    </Box>
  );
}

export default App;

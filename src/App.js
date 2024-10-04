import "./App.css";
import React, { useState } from "react";
import { SidebarProvider } from "./context/SidebarContext";
import Login from "./pages/login/Login";
import Router from "./shared/Router";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Pretendard-Regular", // 선택한 폰트 설정
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoggedIn ? (
        <SidebarProvider>
          <Router /> // 로그인 후 Router 화면
        </SidebarProvider>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} /> // Login 컴포넌트
      )}
    </ThemeProvider>
  );
}

export default App;

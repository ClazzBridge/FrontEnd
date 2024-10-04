import "./App.css";
import { SidebarProvider } from "./context/SidebarContext";
import Login from "./pages/login/Login";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Pretendard-Regular", // 선택한 폰트 설정
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SidebarProvider>
        <Login />

        <Router />
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;

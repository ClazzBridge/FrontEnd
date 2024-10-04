import "./App.css";
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
  return (
    <ThemeProvider theme={theme}>
      <Login>
        <SidebarProvider>
          <Router />
        </SidebarProvider>
      </Login>
    </ThemeProvider>
  );
}

export default App;

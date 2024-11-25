import React from "react";
import { Box } from "@mui/material";
import Login from "./pages/login/Login";
import {SidebarProvider} from "./context/SidebarContext";
import store, {persistor} from "./redux/store";
import {Provider} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {SocketProvider} from "./context/SocketContext";

const App = () => {
  return (
      <Box>
        <PersistGate loading={null} persistor={persistor}>
          <Provider store={store}>
            <SocketProvider>
              <SidebarProvider>
                <Login/>
              </SidebarProvider>
            </SocketProvider>
          </Provider>
        </PersistGate>
      </Box>
  )
};

export default App; // 기본 내보내기
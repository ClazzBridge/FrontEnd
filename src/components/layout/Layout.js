import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "./Topbar";
import SideBar from "./SideBar";

const drawerWidth = 240;
const closedDrawerWidth = 64; // 슬라이드바가 닫혔을 때의 넓이

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: closedDrawerWidth,
      ...(open && {
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: drawerWidth,
      }),
    })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedOpenState = localStorage.getItem("drawerOpen") === "true";
    setOpen(savedOpenState);
  }, []);

  const handleDrawerToggle = () => {
    const newOpenState = !open;
    setOpen(newOpenState);
    localStorage.setItem("drawerOpen", newOpenState);
  };

  return (
      <Box sx={{ display: "flex", backgroundColor: "#f5f5f5", height: "100vh" }}>
        <CssBaseline />
        <TopBar open={open} />
        <SideBar open={open} handleDrawerToggle={handleDrawerToggle} />
        <Main open={open}>
          <DrawerHeader />
          {children}
        </Main>
      </Box>
  );
};

export default Layout;
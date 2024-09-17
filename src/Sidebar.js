import React, { useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";

export const drawerWidth = 240;
const closedDrawerWidth = 64;
const topBarHeight = 64; // 탑바의 높이 설정

const menuItems = [
  {
    title: "게시판",
    subItems: [
      { title: "자유게시판", notifications: 2, icon: <InboxIcon /> },
      { title: "공지사항", notifications: 5, icon: <InboxIcon /> },
    ],
  },
  {
    title: "강의실",
    subItems: [
      { title: "과제", notifications: 3, icon: <InboxIcon /> },
      { title: "질의응답", notifications: 3, icon: <InboxIcon /> },
      { title: "투표", notifications: 3, icon: <InboxIcon /> },
    ],
  },
  {
    title: "채팅",
    subItems: [
      { title: "전체채팅", notifications: 1, icon: <InboxIcon /> },
      { title: "1:1 채팅", notifications: 4, icon: <InboxIcon /> },
    ],
  },
  {
    title: "캘린더",
    subItems: [],
  },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  height: "100%", // 탑바 높이만큼 높이 조정 제거
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: closedDrawerWidth,
  height: "100vh", // 전체 높이로 설정
  borderRight: "1px solid rgba(0, 0, 0, 0.12)", // 오른쪽 경
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  position: "fixed", // 고정 위치
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const MenuButtonContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  left: 0,
  top: 0,
  width: closedDrawerWidth, // 슬라이드바의 넓이와 맞춤
  height: topBarHeight, // 탑바 높이와 맞춤
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: theme.zIndex.drawer + 2,

  margin: "auto", // 가운데 정렬
}));

const Sidebar = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex" }}>
      <MenuButtonContainer>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ margin: "auto" }} // 가운데 정렬
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </MenuButtonContainer>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader />
        {/* <Divider /> 구분선*/}
        <List>
          {menuItems.map((text, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                          display: "none",
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <span
                  style={{
                    color: "gray",
                    fontSize: "12px",
                    display: open ? "block" : "none",
                    fontWeight: "bold",
                  }}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                >
                  {text.title}
                </span>
              </ListItemButton>
              {text.subItems.map((subItem, subIndex) => (
                <div
                  key={subIndex}
                  style={{
                    justifyContent: "space-between",
                    padding: "0px 18px 0px 18px ",
                    height: "40px",
                    display: open ? "flex" : "none",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <ListItemIcon
                    style={{ width: "50px" }}
                    sx={[open ? { display: "block" } : { display: "none" }]}
                  >
                    {subItem.icon}
                  </ListItemIcon>

                  <ListItemText
                    style={{ width: "50px" }}
                    sx={[
                      open
                        ? {
                            display: "block",
                            marginLeft: "-12px",
                          }
                        : {
                            display: "none",
                          },
                    ]}
                  >
                    {subItem.title}
                  </ListItemText>
                </div>
              ))}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

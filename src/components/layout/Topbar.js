import React from "react";
import { useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import profileImage4 from "../../assets/images/image4.jpeg";
import Cookies from "js-cookie";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import Stack from "@mui/material/Stack";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { GitHub } from "@mui/icons-material";

const drawerWidth = 240;
const closedDrawerWidth = 64; // 슬라이드바가 닫혔을 때의 넓이

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    marginLeft: closedDrawerWidth,
    width: `calc(100% - ${closedDrawerWidth}px)`,
  }),
}));

const CustomIconButton = styled(IconButton)({
  borderRadius: "8px",
  color: "#59636E",
  border: "1px solid #D1D9E0",
});

const CustomBadge = styled(Badge)({
  "& .MuiBadge-standard": {
    top: "-7px", // 위치 조정
  },
});

const TopBar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "대시보드";
      case "/about":
        return "About";
      case "/board":
        return "게시판";
      case "/freeboard":
        return "자유게시판";
      case "/noticeboard":
        return "공지사항";
      case "/profile":
        return "마이페이지";
      case "/chat":
        return "채팅";
      case "/lectureroom":
        return "강의실";
      case "/calendar":
        return "캘린더";
      case "/assignment":
        return "과제";
      case "/qna":
        return "질의응답";
      case "/vote":
        return "투표";
      case "/privatechat":
        return "1:1 채팅";
      case "/allchat":
        return "전체 채팅";
      default:
        return "Clazz";
    }
  };

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    navigate("");
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleGitHubClick = () => {
    // const githubUrl = user.githubUrl; // 유저 데이터에서 깃허브 URL 가져오기
    // window.open(githubUrl, "_blank");
    window.open("https://github.com/", "_blank");
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/PasswordCheck");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    Cookies.remove("refreshToken");
    console.log("토큰 제거 ", localStorage.getItem("token"));
    window.location.reload();
  };

  const handleNotificationClick = () => {
    alert("알림");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      sx={{
        top: "48px",
      }}
    >
      <MenuItem onClick={handleProfileClick}>마이페이지</MenuItem>
      <MenuItem onClick={handleLogoutClick}>로그아웃</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <ForumOutlinedIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>프로필수정</p>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{
        boxShadow: "none",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Toolbar
        sx={{
          backgroundColor: "#f6f8fa",
          color: "black",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700 }}
        >
          {getTitle(location.pathname)}
        </Typography>

        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {/* 깃허브 */}
            <LightTooltip title="GitHub">
              <CustomIconButton onClick={handleGitHubClick}>
                <GitHub fontSize="small" />
              </CustomIconButton>
            </LightTooltip>

            {/* 채팅 */}
            <LightTooltip title="채팅">
              <CustomIconButton>
                <CustomBadge badgeContent={4} color="error" max={9}>
                  <ForumOutlinedIcon fontSize="small" />
                </CustomBadge>
              </CustomIconButton>
            </LightTooltip>

            {/* 알림 */}
            <LightTooltip title="알림">
              <CustomIconButton onClick={handleNotificationClick}>
                <CustomBadge badgeContent={19} color="error" max={9}>
                  <NotificationsNoneOutlinedIcon fontSize="small" />
                </CustomBadge>
              </CustomIconButton>
            </LightTooltip>

            {/* 유저 */}
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{ width: "40px", height: "40px" }}
            >
              <LightTooltip title="내 정보">
                <Avatar
                  src={profileImage4}
                  sx={{ width: "40px", height: "40px", marginLeft: "8px" }}
                />
              </LightTooltip>
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  );
};

export default TopBar;

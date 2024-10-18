import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../shared/apiClient";
import { jwtDecode } from "jwt-decode";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Badge,
  Fab,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Stack,
  Box,
  TextField,
  Link,
  Button,
} from "@mui/material";

function ProfileCard({
  seatId,
  name,
  imgSrc,
  isOnline,
  isUnderstanding,
  isHandRaised,
  openModal,
  email,
  github,
  phone,
  bio,
  isSelf,
  isEmpty,
  role,
  onRegisterSeatClick,
  userHasSeat,
  isTeacher,
  isStudent,
  isAdmin,
}) {
  const isGoodOnline = isOnline === true;
  const isOffline = isOnline === false;

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isGoodOnline ? "#28a745" : "#b0b0b0",
      color: "#ffffff",
      boxShadow: `0 0 0 1px ${theme.palette.background.paper}`,
      "&::after": isGoodOnline
        ? {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
          }
        : {},
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(0.9)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.0)",
        opacity: 0,
      },
    },
  }));

  return (
    <Card
      sx={{
        backgroundColor: isTeacher ? "#f0f8ff" : "#ffffff",
        borderRadius: "6px",
        width: "120px",
        textAlign: "center",
        height: "90px",
        boxShadow: isSelf
          ? "0 1px 0px rgba(0, 0, 0, 0.2)"
          : "0 1px 0px rgba(0, 0, 0, 0.1)",
        border:
          !isOffline && isSelf && isUnderstanding
            ? "1px solid #28a745"
            : !isOffline && isSelf && !isUnderstanding
              ? "1px solid transparent"
              : !isOffline && isTeacher && isUnderstanding
                ? "1px solid #28a745"
                : "none",
        backgroundImage:
          !isOffline && isSelf && !isUnderstanding
            ? "linear-gradient(white, white), linear-gradient(to right, #6a0dad, #1e90ff)"
            : "none",
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        filter: isEmpty || isOffline ? "grayscale(100%)" : "none",
        cursor:
          isTeacher || isAdmin || userHasSeat
            ? "default"
            : isEmpty && !userHasSeat
              ? "pointer"
              : "default",
        pointerEvents:
          isEmpty && (isTeacher || isAdmin || userHasSeat)
            ? "none"
            : isTeacher || isAdmin || isStudent
              ? "auto"
              : "none",
      }}
      onClick={
        isTeacher
          ? () =>
              openModal(seatId, name, email, github, phone, bio, imgSrc, isSelf)
          : isEmpty && !userHasSeat && !isTeacher && !isAdmin
            ? onRegisterSeatClick
            : () =>
                openModal(
                  seatId,
                  name,
                  email,
                  github,
                  phone,
                  bio,
                  imgSrc,
                  isSelf
                )
      }
    >
      <CardContent sx={{ padding: "6px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#f4f4f9",
            alignItems: "center",
            position: "relative",
            padding: "0px",
            marginLeft: "-9px",
            marginRight: "-9px",
            top: "-9px",
            height: "20px",
          }}
        >
          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: "500",
              color: isGoodOnline ? "#333" : "#b0b0b0",
              margin: "4px",
            }}
          >
            {isTeacher ? "강사" : `No. ${seatId}`}
          </Typography>
        </div>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isEmpty && isSelf && (!userHasSeat || !isTeacher || !isAdmin) ? (
              <AddIcon
                sx={{
                  position: "absolute",
                  height: "20px",
                  width: "20px",
                  color: "darkGray",
                  marginTop: "50px",
                }}
              />
            ) : !isEmpty ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                badgeContent={
                  <Box
                    sx={{
                      marginLeft: "6px",
                      borderRadius: "50%",
                      width: "8px",
                      height: "8px",
                      backgroundColor: isGoodOnline ? "#28a745" : "#b0b0b0",
                      border: "1px solid",
                    }}
                  />
                }
              >
                <Avatar
                  sx={{
                    width: "30px",
                    height: "30px",
                    filter: isOffline ? "grayscale(100%)" : "none",
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    boxShadow: "0 1px 2px",
                  }}
                  src={imgSrc}
                  alt={`${name}'s profile`}
                />
              </StyledBadge>
            ) : null}
          </Box>
        </Stack>
        {(!isEmpty || isTeacher || isAdmin) && (
          <Typography
            sx={{
              marginTop: "4px",
              fontSize: "12px",
              fontWeight: "600",
              color: isGoodOnline ? "#333" : "#b0b0b0",
            }}
          >
            {name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

// 메인 컴포넌트

export default function StudentRoom() {
  const [open, setOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [releaseDialogOpen, setReleaseDialogOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [currentProfile, setCurrentProfile] = useState({});
  const [profiles, setProfiles] = useState([]);
  const [userSeat, setUserSeat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSeatManagementDialog, setShowSeatManagementDialog] =
    useState(false);
  const [seatManagementMode, setSeatManagementMode] = useState("register"); // "register" 또는 "modify"
  const [seatCount, setSeatCount] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;

    try {
      const response = await apiClient.get("seat/");
      const allProfiles = response.data;

      const studentProfiles = allProfiles.filter(
        (profile) =>
          !profile.memberDTO || profile.memberDTO.memberType !== "ROLE_TEACHER"
      );
      setProfiles(studentProfiles);

      const userSeatData = allProfiles.find(
        (seat) =>
          seat.memberDTO && seat.memberDTO.memberId === currentUser.memberId
      );
      setUserSeat(userSeatData ? userSeatData.id : null);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
  }, [currentUser]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);

      console.log("decodedToken:", decodedToken); // 전체 토큰 정보 확인용
      const memberType = decodedToken.role; // role을 memberType으로 사용

      setCurrentUser({
        memberId: decodedToken.id, // id를 memberId로 설정
        memberType: memberType, // "ROLE_STUDENT"과 같은 역할 설정
      });

      console.log("memberType:", memberType); // 확인용 로그
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  const openProfileModal = (
    seatId,
    name,
    email,
    github,
    phone,
    bio,
    imgSrc,
    isSelf
  ) => {
    setCurrentProfile({
      seatId,
      name,
      email,
      github,
      phone,
      bio,
      imgSrc,
      isSelf,
      memberId: currentUser.memberId,
    });

    console.log("isSelf in openProfileModal:", isSelf);

    setOpen(true);
  };

  const handleReleaseSeat = async () => {
    try {
      await apiClient.delete(`seat/${currentProfile.seatId}`);
      console.log(`${currentProfile.seatId}번 좌석이 해제되었습니다.`);
      fetchData();
      setOpen(false);
      setReleaseDialogOpen(false);
    } catch (error) {
      console.error("좌석 해제 중 오류가 발생했습니다:", error);
    }
  };

  const closeProfileModal = () => {
    setOpen(false);
  };

  const handleRegisterSeatClick = (seatId) => {
    setSelectedSeat(seatId);
    setRegisterDialogOpen(true);
  };

  const handleConfirmRegisterSeat = async () => {
    console.log("Current User:", currentUser);

    if (!currentUser || !currentUser.memberId) {
      console.error("currentUser 또는 memberId가 설정되지 않았습니다.");
      return;
    }

    if (currentUser.memberType !== "ROLE_STUDENT") {
      console.error("학생만 좌석에 등록할 수 있습니다.");
      return;
    }

    const seatUpdateDTO = {
      id: selectedSeat,
      seatNumber: selectedSeat,
      memberId: currentUser.memberId,
    };

    console.log("Sending request data:", seatUpdateDTO);
    console.log("selectedSeat:", selectedSeat);

    try {
      const response = await apiClient.put("seat/assign", seatUpdateDTO);
      console.log(
        `${selectedSeat}번 좌석에 ${currentUser.memberId} 등록되었습니다.`
      );
      setRegisterDialogOpen(false);
      setSelectedSeat(null);
      fetchData();
    } catch (error) {
      console.error("등록 요청 중 오류가 발생했습니다:", error);
    }
  };

  const handleCancelRegisterSeat = () => {
    setRegisterDialogOpen(false);
    setSelectedSeat(null);
  };

  if (!currentUser) {
    return <div>로딩 중...</div>;
  }

  const handleSeatManagement = async () => {
    try {
      const endpoint =
        seatManagementMode === "register" ? "seat/register" : "seat/modify";

      await apiClient.post(endpoint, { seatCount });
      console.log(
        `${seatCount}개의 좌석이 ${
          seatManagementMode === "register" ? "등록" : "수정"
        }되었습니다.`
      );
      setShowSeatManagementDialog(false);
      fetchData();
    } catch (error) {
      console.error("좌석 관리 중 오류가 발생했습니다:", error);
    }
  };

  const handleSeatManagementClick = (mode) => {
    setSeatManagementMode(mode);
    if (profiles.length > 0 && mode === "register") {
      setShowConfirmDialog(true);
    } else {
      setShowSeatManagementDialog(true);
    }
  };

  return (
    <div>
      {currentUser.memberType === "ROLE_ADMIN" && (
        <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
          <Fab
            color="primary"
            aria-label="register"
            onClick={() => handleSeatManagementClick("register")}
            sx={{ mr: 1 }}
          >
            <AddIcon />
          </Fab>
          <Fab
            color="secondary"
            aria-label="modify"
            onClick={() => handleSeatManagementClick("modify")}
          >
            <EditIcon />
          </Fab>
        </Box>
      )}

      {/* 학생 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, 200px)", // 각 카드 너비를 200px로 고정
          gap: "12px", // 카드 간격을 좁게 설정
          padding: "16px",
          justifyContent: "center", // 가운데 정렬로 간격 유지
          maxWidth: "1400px", // 화면에 맞게 조정
          margin: "0 auto",
        }}
      >
        {profiles.map((profile, index) => (
          <ProfileCard
            key={profile.id}
            seatId={profile.id}
            name={profile.member ? profile.member.name : ""}
            imgSrc={profile.member ? profile.member.pictureUrl : ""}
            email={profile.member ? profile.member.email : ""}
            github={profile.member ? profile.member.gitUrl : ""}
            phone={profile.member ? profile.member.phone : ""}
            bio={profile.member ? profile.member.bio : ""}
            isOnline={profile.isOnline}
            isUnderstanding={
              profile.member?.studentStatusDTO?.isUnderstanding ?? false
            }
            isHandRaised={
              profile.member?.studentStatusDTO?.isHandRaised ?? false
            }
            isSelf={
              profile.member && profile.member.id === currentUser.memberId
            }
            onLoad={console.log(
              "profile" +
                profile.member +
                "\n currentUser" +
                currentUser.memberId
            )}
            isEmpty={!profile.member}
            openModal={openProfileModal}
            role={currentUser.memberType}
            onRegisterSeatClick={() => handleRegisterSeatClick(profile.id)}
            userHasSeat={
              userSeat !== null && currentUser.memberType === "ROLE_STUDENT"
            }
            isAdmin={currentUser.memberType === "ROLE_ADMIN"}
            isTeacher={currentUser.memberType === "ROLE_TEACHER"}
            isStudent={currentUser.memberType === "ROLE_STUDENT"}
          />
        ))}
      </div>

      {/* 프로필 모달 */}
      <Dialog open={open} onClose={closeProfileModal}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 1,
            }}
          >
            <Avatar
              src={currentProfile.imgSrc}
              alt={`${currentProfile.name}'s profile`}
              sx={{ width: 100, height: 100, mt: 1, mb: 1 }}
            />
            <Box sx={{ width: "100%", mt: 1 }}>
              {[
                { label: "Name", value: currentProfile.name },
                { label: "Phone Number", value: currentProfile.phone },
                { label: "Email", value: currentProfile.email },
                { label: "GitHub", value: currentProfile.github, isLink: true },
                { label: "Bio", value: currentProfile.bio, isMultiline: true },
              ].map((item, index) => (
                <Box key={index} sx={{ mt: 1 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{ fontSize: "0.7rem" }}
                  >
                    {item.label}
                  </Typography>
                  {item.isLink ? (
                    <Link
                      href={item.value}
                      target="_blank"
                      style={{ textDecoration: "none" }}
                    >
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={item.value}
                        InputProps={{ readOnly: true }}
                        sx={{ fontSize: "0.55rem" }}
                      />
                    </Link>
                  ) : (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={item.value}
                      InputProps={{
                        readOnly: true,
                        style: { pointerEvents: "none" },
                      }}
                      multiline={item.isMultiline}
                      rows={item.isMultiline ? 3 : 1}
                      sx={{ fontSize: "0.55rem" }}
                    />
                  )}
                </Box>
              ))}
            </Box>
            {currentProfile.isSelf && (
              <Button variant="text" onClick={() => setReleaseDialogOpen(true)}>
                자리 해제
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* 좌석 해제 확인 다이얼로그 */}
      <Dialog
        open={releaseDialogOpen}
        onClose={() => setReleaseDialogOpen(false)}
      >
        <DialogTitle>자리 해제 하시겠습니까?</DialogTitle>
        <DialogActions>
          <Button onClick={handleReleaseSeat} color="primary">
            해제
          </Button>
          <Button onClick={() => setReleaseDialogOpen(false)} color="secondary">
            취소
          </Button>
        </DialogActions>
      </Dialog>

      {/* 좌석 등록 확인 다이얼로그 */}
      <Dialog open={registerDialogOpen} onClose={handleCancelRegisterSeat}>
        <DialogTitle>{selectedSeat}번 좌석에 등록하시겠습니까?</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmRegisterSeat} color="primary">
            등록
          </Button>
          <Button onClick={handleCancelRegisterSeat} color="secondary">
            취소
          </Button>
        </DialogActions>
      </Dialog>

      {/* 좌석 관리 다이얼로그 */}
      <Dialog
        open={showSeatManagementDialog}
        onClose={() => setShowSeatManagementDialog(false)}
      >
        <DialogTitle>
          {seatManagementMode === "register" ? "좌석 등록" : "좌석 수정"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>등록할 좌석 수를 입력하세요:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="seatCount"
            label="좌석 수"
            type="number"
            fullWidth
            value={seatCount}
            onChange={(e) => setSeatCount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowSeatManagementDialog(false)}
            color="secondary"
          >
            취소
          </Button>
          <Button onClick={handleSeatManagement} color="primary">
            {seatManagementMode === "register" ? "등록" : "수정"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

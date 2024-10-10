import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Badge,
  Dialog,
  DialogContent,
  Stack,
  Box,
  TextField,
  Link,
  Button,
  DialogActions,
  DialogTitle,
} from "@mui/material";

// 프로필 카드 컴포넌트
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
}) {
  const isGoodOnline = isOnline === true;
  const isOffline = isOnline === false;
  const [hovered, setHovered] = useState(false);

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
              : !isOffline && role === "ROLE_TEACHER" && isUnderstanding
                ? "1px solid #28a745"
                : "none",
        backgroundImage:
          !isOffline && isSelf && !isUnderstanding
            ? "linear-gradient(white, white), linear-gradient(to right, #6a0dad, #1e90ff)"
            : "none",
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        filter: isEmpty || isOffline ? "grayscale(100%)" : "none",
        cursor: isTeacher
          ? "default"
          : isEmpty && !userHasSeat
            ? "pointer"
            : "default",
        pointerEvents: isTeacher
          ? "auto"
          : isEmpty && userHasSeat
            ? "none"
            : "auto",
      }}
      onClick={
        isTeacher
          ? () =>
              openModal(seatId, name, email, github, phone, bio, imgSrc, isSelf)
          : isEmpty && !userHasSeat
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
            {isEmpty && !userHasSeat && !isTeacher ? (
              <AddIcon
                sx={{
                  position: "absolute",
                  height: "20px",
                  width: "20px",
                  color: "darkGray",
                  marginTop: "50px",
                }}
              />
            ) : !isEmpty || isTeacher ? (
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
                      transform: hovered ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                }
              >
                <Avatar
                  sx={{
                    width: "30px",
                    height: "30px",
                    filter: isOffline ? "grayscale(100%)" : "none",
                    transform: hovered ? "scale(1.1)" : "scale(1)",
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
        {(!isEmpty || isTeacher) && (
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
  const [teacherProfile, setTeacherProfile] = useState(null);
  const currentMemberId = "student02";
  const currentRole = "ROLE_STUDENT";

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/seat/");
      const allProfiles = response.data;

      const teacherProfile = allProfiles.find(
        (profile) =>
          profile.memberDTO && profile.memberDTO.memberType === "ROLE_TEACHER"
      );
      setTeacherProfile(teacherProfile);

      const studentProfiles = allProfiles.filter(
        (profile) =>
          !profile.memberDTO || profile.memberDTO.memberType !== "ROLE_TEACHER"
      );
      setProfiles(studentProfiles);

      const userSeatData = studentProfiles.find(
        (seat) => seat.memberDTO && seat.memberDTO.memberId === currentMemberId
      );
      setUserSeat(userSeatData ? userSeatData.id : null);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    });
    setOpen(true);
  };

  const handleReleaseSeat = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/seat/${currentProfile.seatId}`
      );
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
    try {
      await axios.put(
        `http://localhost:8080/api/seat/${selectedSeat}/${currentMemberId}`
      );
      console.log(
        `${selectedSeat}번 좌석에 ${currentMemberId} 등록되었습니다.`
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

  return (
    <div>
      {/* 강사 카드 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {teacherProfile && teacherProfile.memberDTO && (
          <ProfileCard
            seatId={teacherProfile.id}
            name={teacherProfile.memberDTO.name}
            imgSrc={teacherProfile.memberDTO.profileImage.pictureUrl}
            email={teacherProfile.memberDTO.email}
            github={teacherProfile.memberDTO.gitUrl}
            phone={teacherProfile.memberDTO.phone}
            bio={teacherProfile.memberDTO.bio}
            isOnline={teacherProfile.isOnline}
            isUnderstanding={false}
            isHandRaised={false}
            isSelf={false}
            isEmpty={false}
            openModal={openProfileModal}
            role="ROLE_TEACHER"
            isTeacher={true}
            userHasSeat={true}
          />
        )}
      </div>

      {/* 학생 카드 그리드 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px 16px", // 세로 간격 8px, 가로 간격 16px
          padding: "16px",
          maxWidth: "1200px", // 최대 너비를 늘려 6개의 카드가 잘 들어가도록 함
          margin: "0 auto",
        }}
      >
        {profiles.map((profile, index) => (
          <React.Fragment key={profile.id}>
            <ProfileCard
              seatId={profile.id}
              name={profile.memberDTO ? profile.memberDTO.name : ""}
              imgSrc={
                profile.memberDTO
                  ? profile.memberDTO.profileImage.pictureUrl
                  : ""
              }
              email={profile.memberDTO ? profile.memberDTO.email : ""}
              github={profile.memberDTO ? profile.memberDTO.gitUrl : ""}
              phone={profile.memberDTO ? profile.memberDTO.phone : ""}
              bio={profile.memberDTO ? profile.memberDTO.bio : ""}
              isOnline={profile.isOnline}
              isUnderstanding={
                profile.memberDTO?.studentStatusDTO?.isUnderstanding ?? false
              }
              isHandRaised={
                profile.memberDTO?.studentStatusDTO?.isHandRaised ?? false
              }
              isSelf={
                profile.memberDTO &&
                profile.memberDTO.memberId === currentMemberId
              }
              isEmpty={!profile.memberDTO}
              openModal={openProfileModal}
              role={currentRole}
              onRegisterSeatClick={() => handleRegisterSeatClick(profile.id)}
              userHasSeat={userSeat !== null}
            />
            {(index + 1) % 3 === 0 && (index + 1) % 6 !== 0 && (
              <div style={{ width: "32px" }} /> // 3번째 카드 뒤에 더 넓은 간격 추가
            )}
          </React.Fragment>
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
                        InputProps={{ readOnly: true, disableUnderline: true }}
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
                        disableUnderline: true,
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
    </div>
  );
}
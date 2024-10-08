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
}) {
  const isGoodOnline = isOnline === true;
  const isOffline = isOnline === false;
  const [hovered, setHovered] = useState(false);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isGoodOnline ? "#28a745" : "#b0b0b0",
      color: "#ffffff",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
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
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        width: "200px",
        textAlign: "center",
        height: "155px",
        boxShadow: isSelf
          ? "0 1px 0px rgba(0, 0, 0, 0.2)"
          : "0 1px 0px rgba(0, 0, 0, 0.1)",
        border:
          !isOffline && isSelf && isUnderstanding
            ? "2px solid #28a745"
            : !isOffline && isSelf && !isUnderstanding
              ? "2px solid transparent"
              : !isOffline && role === "ROLE_TEACHER" && isUnderstanding
                ? "2px solid #28a745"
                : "none",
        backgroundImage:
          !isOffline && isSelf && !isUnderstanding
            ? "linear-gradient(white, white), linear-gradient(to right, #6a0dad, #1e90ff)"
            : "none",
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        filter: isEmpty || isOffline ? "grayscale(100%)" : "none",
        cursor: isEmpty ? "pointer" : "default",
      }}
      onClick={
        isEmpty
          ? onRegisterSeatClick
          : () =>
              openModal(seatId, name, email, github, phone, bio, imgSrc, isSelf)
      }
    >
      <CardContent>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#f4f4f9",
            alignItems: "center",
            position: "relative",
            padding: "0px",
            marginLeft: "-16px",
            marginRight: "-16px",
            top: "-16px",
            height: "35px",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "500",
              color: isGoodOnline ? "#333" : "#b0b0b0",
              margin: "10px",
            }}
          >
            No. {seatId}
          </Typography>
        </div>

        <Stack
          direction="row"
          spacing={2}
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
            {isEmpty ? (
              <AddIcon
                sx={{
                  position: "absolute",
                  height: "35px",
                  width: "35px",
                  color: "darkGray",
                  marginTop: "75px",
                }}
              />
            ) : (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                badgeContent={
                  <Box
                    sx={{
                      marginLeft: "11px",
                      borderRadius: "50%",
                      width: "14px",
                      height: "14px",
                      backgroundColor: isGoodOnline ? "#28a745" : "#b0b0b0",
                      border: "2px solid",
                      transform: hovered ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                }
              >
                <Avatar
                  sx={{
                    marginTop: "5px",
                    width: "50px",
                    height: "50px",
                    filter: isOffline ? "grayscale(100%)" : "none",
                    transform: hovered ? "scale(1.1)" : "scale(1)",
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    boxShadow: "0 1px 3px",
                  }}
                  src={imgSrc}
                  alt={`${name}'s profile`}
                />
              </StyledBadge>
            )}
          </Box>
        </Stack>

        {!isEmpty && (
          <Typography
            sx={{
              marginTop: "8px",
              fontSize: "16px",
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
  const currentMemberId = "student02";
  const currentRole = "ROLE_STUDENT";

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/seat/");
      setProfiles(response.data);
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
    <div
      style={{
        display: "grid",
        gap: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "0px",
        maxWidth: "1200px",
        gridTemplateColumns: "repeat(5, 1fr)",
      }}
    >
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          seatId={profile.id}
          name={profile.memberDTO ? profile.memberDTO.name : "Empty Seat"}
          imgSrc={
            profile.memberDTO ? profile.memberDTO.profileImage.pictureUrl : ""
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
            profile.memberDTO && profile.memberDTO.memberId === currentMemberId
          }
          isEmpty={!profile.memberDTO}
          openModal={openProfileModal}
          role={currentRole}
          onRegisterSeatClick={() => handleRegisterSeatClick(profile.id)}
        />
      ))}

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

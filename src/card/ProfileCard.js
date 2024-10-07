import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
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
} from "@mui/material";

// 프로필 카드 컴포넌트
function ProfileCard({
  seatNumber,
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
  isSelf, // 자신 여부
  isEmpty, // 공석 여부
  role, // 역할 (STUDENT 또는 TEACHER)
  onRegisterSeat, // 좌석 등록 콜백
}) {
  const isGoodOnline = isOnline === true;
  const isOffline = isOnline === false;

  const [hovered, setHovered] = useState(false); // 이미지 호버 상태 관리

  // 스타일 설정: 온라인 상태일 때 애니메이션 효과 적용
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isGoodOnline ? "#28a745" : "#b0b0b0", // 온라인: 초록색, 오프라인: 회색
      color: "#ffffff",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": isGoodOnline
        ? {
            position: "absolute",
            top: -1,
            left: -1,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            animation: "ripple 1.2s infinite ease-in-out",
            border: "1px solid currentColor",
            content: '""',
          }
        : {}, // 오프라인은 애니메이션 효과 없음
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
        padding: "0px",
        margin: "0px",
        height: "155px",
        boxShadow: isSelf
          ? "0 2px 4px rgba(0, 0, 0, 0.2)"
          : "0 2px 4px rgba(0, 0, 0, 0.1)", // 본인일 경우 더 강한 그림자

        // 학생일 때: 본인 이해도만 표시 (ROLE_STUDENT)
        border:
          role === "ROLE_STUDENT" && isSelf && isUnderstanding && !isOffline
            ? "2px solid #28a745" // 본인이 이해한 경우 초록색 테두리
            : role === "ROLE_STUDENT" &&
                isSelf &&
                !isUnderstanding &&
                !isOffline
              ? "2px solid transparent" // 본인이 이해하지 못한 경우 그라데이션
              : role === "ROLE_TEACHER" && isUnderstanding && !isOffline
                ? "2px solid #28a745" // 강사가 보는 모든 학생 이해한 경우 초록색 테두리
                : "none", // 강사가 보는 학생 이해하지 못한 경우 테두리 없음

        // 본인이 이해하지 못한 경우 그라데이션
        backgroundImage:
          role === "ROLE_STUDENT" && isSelf && !isUnderstanding && !isOffline
            ? "linear-gradient(white, white), linear-gradient(to right, #6a0dad, #1e90ff)" // 본인인 경우에만 그라데이션
            : "none", // 그라데이션은 본인일 경우에만 표시

        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        filter: isEmpty || isOffline ? "grayscale(100%)" : "none", // 공석 또는 오프라인일 경우 흑백 필터 적용
        position: "relative",
      }}
    >
      <CardContent>
        {/* 빈 좌석일 경우 자리 등록 버튼 추가 */}
        {isEmpty && (
          <Button
            variant="outlined"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              fontSize: "12px",
              padding: "5px",
            }}
            onClick={onRegisterSeat} // 좌석 등록 콜백 함수 호출
          >
            자리 등록
          </Button>
        )}
        {/* 상단 번호 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#f4f4f9",
            alignItems: "center",
            position: "relative",
            padding: "0px 0px",
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
              fontFamily: "",
              color: isGoodOnline ? "#333" : "#b0b0b0", // 온라인: 진한 색, 오프라인: 회색
              margin: "10px",
            }}
          >
            No. {seatNumber}
          </Typography>
        </div>

        {/* 프로필 이미지 */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          {isEmpty ? (
            <Typography sx={{ mt: 2, color: "#aaa" }}></Typography>
          ) : (
            <>
              {!isSelf ? (
                <StyledBadge
                  sx={{
                    "& .MuiBadge-badge": {
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                    },
                  }}
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  badgeContent={
                    <Box
                      label={isGoodOnline ? "온라인" : "오프라인"}
                      alt="Small Avatar"
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                      sx={{
                        marginLeft: "11px",
                        borderRadius: "50%",
                        width: "14px",
                        height: "14px",
                        color: "white",
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
                    onClick={() =>
                      openModal(name, email, github, phone, bio, imgSrc, isSelf)
                    }
                  />
                </StyledBadge>
              ) : (
                <Avatar
                  sx={{
                    marginTop: "5px",
                    width: "50px",
                    height: "50px",
                    transform: hovered ? "scale(1.1)" : "scale(1)",
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    boxShadow: "0 1px 3px",
                  }}
                  src={imgSrc}
                  alt={`${name}'s profile`}
                  onClick={() =>
                    openModal(name, email, github, phone, bio, imgSrc)
                  }
                />
              )}
            </>
          )}
        </Stack>

        {/* 이름 표시 */}
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
  const [currentProfile, setCurrentProfile] = useState({});
  const [profiles, setProfiles] = useState([]);
  const currentMemberId = "student01"; // 로그인된 사용자 ID
  const currentRole = "ROLE_STUDENT"; // 역할을 'STUDENT' 또는 'TEACHER'로 설정

  // 서버에서 좌석 데이터를 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/seat/");
        setProfiles(response.data);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    fetchData();
  }, []);

  // 모달 열기 함수
  const openProfileModal = (
    name,
    email,
    github,
    phone,
    bio,
    imgSrc,
    isSelf
  ) => {
    setCurrentProfile({ name, email, github, phone, bio, imgSrc, isSelf });
    setOpen(true);
  };

  // 모달 닫기 함수
  const closeProfileModal = () => {
    setOpen(false);
  };

  // 자리 등록 콜백 함수
  const handleRegisterSeat = (seatNumber) => {
    console.log(`${seatNumber}번 좌석에 등록 요청`);
    // 여기서 좌석 등록 API 호출을 추가할 수 있음
  };

  return (
    <div
      style={{
        display: "grid",
        gap: "20px",
        marginLeft: "auto",
        marginRight: "auto",
        padding: "20px",
        maxWidth: "1000px",
        gridTemplateColumns: "repeat(5, 1fr)", // 한 줄에 5개의 칸
      }}
    >
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          seatNumber={profile.seatNumber}
          name={profile.memberDTO ? profile.memberDTO.name : "Empty Seat"}
          imgSrc={
            profile.memberDTO ? profile.memberDTO.profileImage.pictureUrl : ""
          }
          email={profile.memberDTO ? profile.memberDTO.email : ""}
          github={profile.memberDTO ? profile.memberDTO.gitUrl : ""}
          phone={profile.memberDTO ? profile.memberDTO.phone : ""}
          bio={profile.memberDTO ? profile.memberDTO.bio : ""}
          isOnline={profile.isOnline}
          isUnderstanding={profile.isUnderstanding}
          isHandRaised={profile.isHandRaised}
          isSelf={
            profile.memberDTO && profile.memberDTO.memberId === currentMemberId
          }
          isEmpty={!profile.memberDTO} // memberDTO가 없으면 빈 좌석으로 설정
          openModal={openProfileModal}
          role={currentRole} // 사용자 역할을 ProfileCard로 전달
          onRegisterSeat={() => handleRegisterSeat(profile.seatNumber)} // 좌석 등록 콜백 전달
        />
      ))}

      {/* 모달 컴포넌트 */}
      <Dialog
        open={open}
        onClose={closeProfileModal}
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "300px",
            width: "80%",
            margin: "auto",
          },
        }}
      >
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
                        InputProps={{
                          readOnly: true,
                          disableUnderline: true,
                        }}
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
            {/* 자리 해제 버튼 (자신의 좌석일 경우에만 표시) */}
            {currentProfile.isSelf && (
              <Button
                variant="contained"
                color="error"
                sx={{ marginTop: 20 }}
                onClick={() => console.log("자리 해제")}
              >
                자리 해제
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

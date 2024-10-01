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
} from "@mui/material";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import AppleIcon from "@mui/icons-material/Apple";
import CloseIcon from "@mui/icons-material/Close";

// 프로필 카드 컴포넌트
function ProfileCard({
  seatNumber,
  name,
  imgSrc,
  isOccupied,
  isSelf,
  openModal,
  email,
  github,
  phone,
  message,
  isUnderstand,
  isEmpty,
}) {
  const isOnline = isOccupied === "online";
  const isOffline = isOccupied === "offline";
  const seatAbsent = isOccupied === "no_seat";

  const isGoodStatus = isUnderstand === "good";
  const isBadStatus = isUnderstand === "bad";

  const showisOccupied = !isSelf && !isEmpty && !seatAbsent;

  const [hovered, setHovered] = useState(false); // 이미지 호버 상태 관리
  const [comprehension, setComprehension] = useState(true); // 이해도 상태 (true: 이해함, false: 이해 못함)

  // 이해도 토글 함수
  const toggleComprehension = () => {
    setComprehension((prev) => !prev); // true <-> false 토글
  };

  // 이해도에 따른 색상
  const getComprehensionColor = () => {
    return comprehension ? "#28a745" : "red"; // 이해함: 초록색, 이해 못함: 빨간색
  };

  // 스타일 설정: 온라인 상태일 때 애니메이션 효과 적용
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isOnline ? "#28a745" : "#b0b0b0", // 온라인: 초록색, 오프라인: 회색
      color: "#ffffff",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": isOnline
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
          ? "0 4px 12px rgba(0, 0, 0, 0.2)"
          : "0 4px 8px rgba(0, 0, 0, 0.1)", // 본인일 경우 더 강한 그림자
        border: isUnderstand && !isOffline ? "2px solid transparent" : "none", // 상태가 있고 오프라인이 아닌 경우에만 테두리
        backgroundImage:
          isUnderstand && !isOffline
            ? "linear-gradient(white, white), linear-gradient(to right, #28a745, #28a745)" // 상태가 있고 오프라인이 아닌 경우 그라데이션 테두리
            : "none",
        backgroundOrigin: "border-box",
        backgroundClip: "content-box, border-box",
        filter: isEmpty || isOffline ? "grayscale(100%)" : "none", // 공석 또는 오프라인일 경우 흑백 필터 적용
        position: "relative", // 추가 디자인 요소를 위한 포지션 설정
      }}
    >
      <CardContent>
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
              color: isOnline ? "#333" : "#b0b0b0", // 온라인: 진한 색, 오프라인: 회색
              margin: "10px",
            }}
          >
            No. {seatNumber}
          </Typography>
        </div>

        {/* 공석일 경우 이름과 상태를 숨기고 프로필 이미지만 흐리게 표시 */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          {isEmpty ? (
            // 공석일 때 아무 것도 표시하지 않음
            <Typography sx={{ mt: 2, color: "#aaa" }}></Typography>
          ) : (
            // 공석이 아닐 때 아래 로직 실행
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
                      label={isOnline ? "온라인" : "오프라인"}
                      alt="Small Avatar"
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                      sx={{
                        marginLeft: "11px",
                        borderRadius: "50%",
                        width: "14px",
                        height: "14px",
                        color: "white",
                        backgroundColor: isOnline ? "#28a745" : "#b0b0b0",
                        border: "2px solid",
                        transition: "transform 0.3s ease, opacity 0.3s ease",
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
                      transition: "transform 0.3s ease",
                      transform: hovered ? "scale(1.1)" : "scale(1)",
                      cursor: "pointer",
                      border: "1px solid #ddd",
                      boxShadow: "0 1px 3px",
                      textAlign: "center",
                    }}
                    src={imgSrc}
                    alt={`${name}'s profile`}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() =>
                      openModal(name, email, github, phone, message, imgSrc)
                    }
                  />
                </StyledBadge>
              ) : (
                <Avatar
                  sx={{
                    marginLeft: "0px",
                    marginTop: "5px",
                    width: "50px",
                    height: "50px",
                    transition: "transform 0.3s ease",
                    transform: hovered ? "scale(1.1)" : "scale(1)",
                    cursor: "pointer",
                    border: "1px solid #ddd",
                    boxShadow: "0 1px 3px",
                    textAlign: "center",
                  }}
                  src={imgSrc}
                  alt={`${name}'s profile`}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onClick={() =>
                    openModal(name, email, github, phone, message, imgSrc)
                  }
                />
              )}
            </>
          )}
        </Stack>

        {/* 이름 (공석일 경우 표시 안함) */}
        {!isEmpty && (
          <Typography
            sx={{
              marginTop: "8px",
              fontSize: "16px",
              fontWeight: "600",
              color: isOnline ? "#333" : "#b0b0b0", // 온라인: 진한 색, 오프라인: 회색
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

  // 서버에서 좌석 데이터를 가져오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/seat/");
        console.log(response.data); // 브라우저 콘솔에서 데이터를 확인
        setProfiles(response.data); // 받아온 데이터를 상태로 저장
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    // 비동기 함수 호출
    fetchData();
  }, []);

  // 모달 열기 함수
  const openProfileModal = (name, email, github, phone, message, imgSrc) => {
    setCurrentProfile({
      name,
      email,
      github,
      phone,
      message,
      imgSrc, // 프로필 이미지도 상태로 저장
    });
    setOpen(true);
  };

  // 모달 닫기 함수
  const closeProfileModal = () => {
    setOpen(false);
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
      {profiles.map((profile, index) => (
        <ProfileCard
          key={index}
          seatNumber={profile.seatNumber}
          name={profile.member ? profile.member.name : "Empty Seat"}
          imgSrc={profile.member ? profile.member.profileImage.pictureUrl : ""}
          email={profile.member ? profile.member.email : ""}
          github={profile.member ? profile.member.gitUrl : ""}
          phone={profile.member ? profile.member.phone : ""}
          message={profile.member ? profile.member.bio : ""}
          isOccupied={profile.occupied ? "online" : "offline"}
          openModal={openProfileModal}
          isEmpty={!profile.member}
          isUnderstand={profile.understand}
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
                {
                  label: "Bio",
                  value: currentProfile.message,
                  isMultiline: true,
                },
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
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

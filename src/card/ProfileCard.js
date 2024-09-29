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
import CloseIcon from "@mui/icons-material/Close";

// 프로필 카드 컴포넌트
function ProfileCard({
  seatNumber,
  name,
  imgSrc,
  status,
  isSelf,
  openModal,
  email,
  github,
  phone,
  message,
  isEmpty,
}) {
  const isOnline = status === "online";
  const isOffline = status === "offline";
  const seatAbsent = status === "no_seat";

  const showStatus = !isSelf && !isEmpty && !seatAbsent;

  const [hovered, setHovered] = useState(false); // 이미지 호버 상태 관리
  const [comprehension, setComprehension] = useState(true); // 이해도 상태 (true: 이해함, false: 이해 못함)

  // 이해도 토글 함수
  const toggleComprehension = () => {
    setComprehension((prev) => !prev); // true <-> false 토글
  };

  // 이해도에 따른 색상
  const getComprehensionColor = () => {
    return comprehension ? "green" : "red"; // 이해함: 초록색, 이해 못함: 빨간색
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
        border: isSelf ? "2px solid transparent" : "none", // 테두리 없을 때 기본값
        backgroundImage: isSelf
          ? "linear-gradient(white, white), linear-gradient(to right, #6a11cb, #2575fc)" // 본인일 경우 그라데이션 테두리
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
              fontSize: "17px",
              fontWeight: "500",
              fontFamily: "Arial sansSerif",
              color: isOnline ? "#333" : "#b0b0b0", // 온라인: 진한 색, 오프라인: 회색
              margin: "10px",
            }}
          >
            No. {seatNumber}
          </Typography>

          {/* 이해도 표시 아이콘 */}
          {isSelf && (
            <WbIncandescentIcon
              sx={{
                color: getComprehensionColor(), // 이해도에 따른 색상 적용
                cursor: "pointer", // 클릭 가능하도록 커서 설정
              }}
              onClick={toggleComprehension} // 클릭 시 이해도 토글
            />
          )}
        </div>

        {/* 공석일 경우 이름과 상태를 숨기고 프로필 이미지만 흐리게 표시 */}
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          {!isSelf ? (
            <StyledBadge
              sx={{
                "& .MuiBadge-badge": {
                  width: "10px", // 배지의 크기를 키움
                  height: "10px", // 배지의 크기를 키움
                  borderRadius: "50%", // 원형 유지
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
                    backgroundColor: isOnline ? "#28a745" : "#b0b0b0", // 온라인: 초록색, 오프라인: 회색
                    border: "2px solid",
                    transition: "transform 0.3s ease, opacity 0.3s ease", // 애니메이션 적용
                    transform: hovered ? "scale(1.1)" : "scale(1)", // 호버 시 확대
                  }}
                />
              }
            >
              <Avatar
                sx={{
                  marginTop: "5px",
                  width: "50px", // 큰 아바타 크기
                  height: "50px",
                  filter: isOffline ? "grayscale(100%)" : "none", // 오프라인: 흑백 필터
                  transition: "transform 0.3s ease", // 호버 애니메이션 추가
                  transform: hovered ? "scale(1.1)" : "scale(1)", // 호버 시 이미지 확대
                  cursor: "pointer", // 클릭 가능한 상태를 나타내는 커서
                  border: "1px solid #ddd",
                  boxShadow: "0 1px 3px",
                  textAlign: "center",
                }}
                src={imgSrc}
                alt={`${name}'s profile`}
                onMouseEnter={() => setHovered(true)} // 호버 시작
                onMouseLeave={() => setHovered(false)} // 호버 종료
                onClick={() => openModal(name, email, github, phone, message, imgSrc)} // 클릭하면 모달 열기
              />
            </StyledBadge>
          ) : (
            <Avatar
              sx={{
                marginLeft: "0px",
                marginTop: "5px",
                width: "50px", // 큰 아바타 크기
                height: "50px",
                transition: "transform 0.3s ease", // 호버 애니메이션 추가
                transform: hovered ? "scale(1.1)" : "scale(1)", // 호버 시 이미지 확대
                cursor: "pointer", // 클릭 가능한 상태를 나타내는 커서
                border: "1px solid #ddd",
                boxShadow: "0 1px 3px",
                textAlign: "center",
              }}
              src={imgSrc}
              alt={`${name}'s profile`}
              onMouseEnter={() => setHovered(true)} // 호버 시작
              onMouseLeave={() => setHovered(false)} // 호버 종료
              onClick={() => openModal(name, email, github, phone, message, imgSrc)} // 클릭하면 모달 열기
            />
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
          const response = await axios.get("http://localhost:8081/api/seat/");
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
    <div style={{ display: "grid", gap: "20px", marginLeft: "auto", marginRight: "auto", padding: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", maxWidth: "1200px" }}>
      {profiles.map((profile, index) => (
        <ProfileCard
          key={index}
          seatNumber={profile.seatNumber}
          name={profile.user ? profile.user.name : "Empty Seat"}
          imgSrc={profile.user ? profile.user.profileImage.pictureUrl : ""}
          email={profile.user ? profile.user.email : ""}
          github={profile.user ? profile.user.gitUrl : ""}
          phone={profile.user ? profile.user.phone : ""}
          message={profile.user ? profile.user.bio : ""}
          status={profile.occupied ? "online" : "offline"}
          isSelf={profile.user?.name === "권준성"}
          openModal={openProfileModal}
          isEmpty={!profile.user}
        />
      ))}
  
        {/* 모달 컴포넌트 */}
        <Dialog
  open={open}
  onClose={closeProfileModal}
  BackdropProps={{ style: { backgroundColor: 'transparent' } }}
  sx={{ '& .MuiDialog-paper': { maxWidth: '300px', width: '80%', margin: 'auto' } }} // 모달 크기 조정
>
<DialogContent>
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 1 }}>
    <Avatar
      src={currentProfile.imgSrc}
      alt={`${currentProfile.name}'s profile`}
      sx={{ width: 100, height: 100, mt: 1, mb: 1 }}
    />
    <Box sx={{ width: '100%', mt: 1 }}>
      {[
        { label: "Name", value: currentProfile.name },
        { label: "Phone Number", value: currentProfile.phone },
        { label: "Email", value: currentProfile.email },
        { label: "GitHub", value: currentProfile.github, isLink: true },
        { label: "Bio", value: currentProfile.message, isMultiline: true }
      ].map((item, index) => (
        <Box key={index} sx={{ mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '0.7rem' }}>
            {item.label}
          </Typography>
          {item.isLink ? (
            <Link href={item.value} target="_blank" style={{ textDecoration: 'none' }}>
              <TextField
                fullWidth
                variant="outlined"
                value={item.value}
                InputProps={{
                  readOnly: true,
                  disableUnderline: true
                }}
                sx={{ fontSize: '0.55rem' }}
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
                style:{pointerEvents: "none",}
              }}
              multiline={item.isMultiline}
              rows={item.isMultiline ? 3 : 1}
              sx={{ fontSize: '0.55rem' }}
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

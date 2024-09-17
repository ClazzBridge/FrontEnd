import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import MainLayout from "./MainLayout";
import ProfileForm from "./ProfileForm";
import Cookies from "js-cookie";

const Dashboard = ({ onLogout }) => {
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                console.log('Sending request with token:', token);  // 토큰을 로그로 출력
                const tokenPayload = parseJwt(token);
                setUserId(tokenPayload.id);  // 토큰에서 userId 추출

                const response = await axios.get(`http://localhost:8080/userlist/${tokenPayload.id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setUserData(response.data);
            } catch (error) {
                console.error("데이터 불러오기 실패:", error);
                // 더 많은 에러 정보 로그
                console.error("Error response:", error.response);
                console.error("Error message:", error.message);
                console.error("Error config:", error.config);
            }
        } else {
            console.log('No token found in localStorage');
        }
    };

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    };

    useEffect(() => {
        fetchUserData(); // 컴포넌트 마운트 시 호출
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", width: "100%" }}>
            <MainLayout>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", overflowY: "auto" }} // 스크롤 가능하도록 설정
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                        }}
                    >
                        <Typography variant="h4"></Typography>
                        <Button variant="outlined" onClick={onLogout}>
                            로그아웃
                        </Button>
                    </Box>
                    {userId && <ProfileForm userId={userId} />} {/* userId를 ProfileForm에 전달 */}
                </Box>
            </MainLayout>
        </Box>
    );
};

export default Dashboard;

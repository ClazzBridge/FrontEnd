import { React, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";

const Home = () => {
    const { userInfo } = useContext(UserContext);

    // 예시 데이터
    const newPostsCount = 5; // 새로 올라온 게시글 수
    const totalStudents = 23; // 총 수강생 인원 수정

    // Timer

    // 학원 일정 데이터
    const courseName = "웹 개발 과정";
    const startDate = new Date("2024-05-24"); // 시작 날짜 수정
    const endDate = new Date("2024-12-03"); // 종료 날짜 수정
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysRemaining = totalDays - daysPassed;

    // 진행 상황 비율 계산
    const progressPercentage = Math.round((daysPassed / totalDays) * 100);

    // 출석률 예시 데이터
    const attendanceRate = 85; // 출석률

    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('Seoul'); // 기본 도시 설정
    const [error, setError] = useState('');

    const API_KEY = 'YOUR_API_KEY'; // 여기에 OpenWeatherMap API 키를 입력하세요.

    const fetchWeather = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${'67469ac1032528c1feebbdf683151284'}&units=metric`
            );
            setWeather(response.data);
            setError('');
        } catch (err) {
            setError('날씨 정보를 가져오는 데 실패했습니다.');
            setWeather(null);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, [city]);

    return (
        <>
            <div>
                <h1>날씨 정보</h1>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="도시 이름 입력"
                />
                <button onClick={fetchWeather}>날씨 가져오기</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                {weather && (
                    <div>
                        <h2>{weather.name}</h2>
                        <p>온도: {weather.main.temp} °C</p>
                        <p>상태: {weather.weather[0].description}</p>
                    </div>
                )}
            </div>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    height: "100vh",
                    padding: "20px",
                }}
            >
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                position: "relative",
                                padding: "40px",
                                borderRadius: "20px",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: "-20px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "0",
                                    height: "0",
                                    borderLeft: "20px solid transparent",
                                    borderRight: "20px solid transparent",
                                    borderTop: "20px solid #ffffff",
                                },
                            }}
                        >
                            {userInfo && userInfo.member ? (
                                <Typography variant="h4" sx={{ fontWeight: 600, color: "#333" }}>
                                    환영합니다, {userInfo.member.name}님!
                                </Typography>
                            ) : (
                                <Typography variant="h5" sx={{ color: "#666" }}>
                                    Home
                                </Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* 새로 올라온 게시글 수 카드 */}
                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "20px",
                                borderRadius: "20px",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 500, color: "#333" }}>
                                새로 올라온 게시글 수
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: "#007aff" }}>
                                {newPostsCount}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* 총 수강생 인원 카드 수정 */}
                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "20px",
                                borderRadius: "20px",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 500, color: "#333" }}>
                                총 수강생 인원
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: "#007aff" }}>
                                {totalStudents}명
                            </Typography>
                        </Paper>
                    </Grid>
                    {/* 학원 일정 카드 */}
                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "20px",
                                borderRadius: "20px",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={progressPercentage}
                                    sx={{ width: 250, height: 250, marginBottom: "10px" }} // 크기 조정
                                    color="primary" // 진행된 부분 색상
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700, color: "#007aff" }}
                                >
                                    {progressPercentage}%
                                </Typography>
                                <Typography
                                    sx={{ fontWeight: 500, color: "#333", marginTop: "10px" }}
                                >
                                    과정명: {courseName}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#666" }}>
                                    시작 날짜: {startDate.toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#666" }}>
                                    종료 날짜: {endDate.toLocaleDateString()}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#666" }}>
                                    경과 일수: {daysPassed}일
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#666" }}>
                                    남은 일수: {daysRemaining}일
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* 출석률 카드 추가 */}
                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "20px",
                                borderRadius: "20px",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 500, color: "#333" }}>
                                출석률
                            </Typography>
                            <Typography variant="h2" sx={{ fontWeight: 700, color: "#007aff" }}>
                                {attendanceRate}%
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* 문의하기 버튼 추가 및 크기 조정 */}
                    <Grid item xs={12} md={6} lg={3}>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "20px",
                                borderRadius: "20px",
                                textAlign: "center",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 500, color: "#333" }}>
                                문의하기
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: "10px" }}
                            >
                                문의하기
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
export default Home;

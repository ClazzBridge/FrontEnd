import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // 검색 아이콘
import { getUserCourseFreePosts } from "../../services/apis/post/get";

export default function FreeBoard() {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]); // 게시글 상태 추가
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가

  const getUserInfo = () => {
    try {
      const userInfoString = localStorage.getItem("userInfo");

      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        console.log(userInfo, "userinfo");
        return userInfo;
      }

      return null;
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      return null;
    }
  };

  const fetchUserCourseFreePosts = async () => {
    try {
      const data = await getUserCourseFreePosts(); // API 호출
      setPosts(data); // 상태 업데이트
    } catch (error) {
      console.error("게시글을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    const fetchedUserInfo = getUserInfo();
    setUserInfo(fetchedUserInfo);
    fetchUserCourseFreePosts(); // 컴포넌트 마운트 시 게시글 데이터 가져오기
  }, []);

  // 검색 기능
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="게시글 제목 검색..."
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: "515px", // 검색바 길이 조정
            height: "24px", // 검색바 높이 조정
            marginBottom: 5,
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              "& fieldset": {
                borderColor: "#f6f8fa", // 아웃라인 색상 설정
              },
              "&:hover fieldset": {
                borderColor: "#f6f8fa", // 호버 시 아웃라인 색상
              },
              "&.Mui-focused fieldset": {
                borderColor: "#f6f8fa", // 포커스 시 아웃라인 색상
              },
            },
          }} // 검색창 스타일 조정
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#888" }} />
                {/* 검색 아이콘 색상 조정 */}
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{ border: "none", boxShadow: "none" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ borderBottom: "none", fontSize: "12px", fontWeight: 500 }}
              >
                제목
              </TableCell>
              <TableCell
                sx={{ borderBottom: "none", fontSize: "12px", fontWeight: 500 }}
              >
                작성자
              </TableCell>
              <TableCell
                sx={{ borderBottom: "none", fontSize: "12px", fontWeight: 500 }}
              >
                작성일
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TableRow
                  key={post.id}
                  sx={{ borderBottom: "1px solid #f6f8fa" }}
                >
                  <TableCell sx={{ border: "none" }}>{post.title}</TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {post.authorName}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow sx={{ borderBottom: "1px solid #f6f8fa" }}>
                <TableCell colSpan={3} align="center" sx={{ border: "none" }}>
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

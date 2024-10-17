import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Avatar,
  Alert,
} from "@mui/material";
import { getCommentByPost } from "../../services/apis/comment/get";
import { saveComment } from "../../services/apis/comment/post";

export default function PostComment({ postId }) {
  const [comments, setComments] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const fetchedComments = await getCommentByPost(postId);
      setComments(fetchedComments);
      console.log(comments);
    } catch (error) {
      console.error("댓글을 불러오는 중 오류 발생:", error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const commentRequestDTO = {
        content: newComment,
        postId: postId,
      };

      await saveComment(commentRequestDTO);

      setNewComment("");

      await fetchComments();
    } catch (error) {
      console.log(error, "error");
    }
  };

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

  useEffect(() => {
    const fetchedUserInfo = getUserInfo();
    setUserInfo(fetchedUserInfo);
  }, []);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
      return "지금";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 30) {
      return `${diffInDays}일 전`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}개월 전`;
    } else if (diffInYears < 10) {
      return `${diffInYears}년 전`;
    } else {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}. ${month}. ${day}`;
    }
  };

  return (
    <>
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        댓글 {comments.length}개
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 60,
          marginTop: 4,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {userInfo && (
          <>
            <Avatar
              alt={userInfo.member?.name || "User"}
              src={
                userInfo.member?.profileImageUrl ||
                "/static/images/avatar/1.jpg"
              }
            />
          </>
        )}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="댓글을 입력하세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          multiline
          minRows={1}
          maxRows={Infinity}
          sx={{
            margin: "0px 1px",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "none",
              },
            "& .MuiInputBase-root": {
              padding: "8px 14px",
              resize: "none", // 수동 조정 방지
              display: "flex",
              alignItems: "flex-start", // 텍스트가 위쪽에서 시작하도록 설정
              overflowY: "hidden", // 스크롤이 생기지 않게 설정
            },
            "& textarea": {
              lineHeight: "1.5",
              overflow: "hidden", // 스크롤 숨기기
              height: "auto", // 자동으로 높이 조절
              resize: "none", // 크기 수동 조정 불가
              boxSizing: "border-box", // padding과 border 고려하여 크기 계산
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
          sx={{
            backgroundColor: "#34495e",
          }}
        >
          작성
        </Button>
      </Box>

      <Box
        className="comments-container"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {comments.length > 0 && (
          <Box className="comments-list">
            {comments.map((comment) => (
              <Box
                key={comment.id}
                className="comment-item"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 3,
                }}
              >
                <Avatar
                  alt={comment?.author || "User"}
                  src={
                    comment?.profileImageUrl || "/static/images/avatar/1.jpg"
                  }
                  sx={{
                    marginRight: 1.5,
                  }}
                />
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      className="comment-author"
                      sx={{ fontSize: "13px", fontWeight: 600, marginRight: 1 }}
                    >
                      {comment.author}
                    </Typography>
                    <Typography
                      className="comment-date"
                      sx={{
                        fontSize: "12px",
                        color: "darkgray",
                      }}
                    >
                      {formatRelativeTime(comment.createdAt)}
                    </Typography>
                  </Box>
                  <Typography
                    className="comment-content"
                    sx={{ fontSize: "14px" }}
                  >
                    {comment.content}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}

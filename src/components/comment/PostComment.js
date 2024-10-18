import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Avatar } from "@mui/material";
import { getCommentByPost } from "../../services/apis/comment/get";
import { saveComment } from "../../services/apis/comment/post";
import Menu from "../../components/common/Menu";

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

  const handleInput = (event) => {
    // 입력 내용에 따라 높이를 자동으로 조정
    event.target.style.height = "auto"; // 높이를 초기화
    event.target.style.height = `${event.target.scrollHeight}px`; // 내용에 맞게 높이 조정
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
          width: "100%", // Box의 너비 설정
          display: "flex",
          margin: "18px 0",
          overflow: "hidden", // Box 밖으로 나가지 않도록 설정
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
        <Box className="textBox" sx={{ width: "100%" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onInput={handleInput} // 입력 시 높이 조정
            onChange={(e) => setNewComment(e.target.value)}
            multiline
            minRows={1}
            maxRows={Infinity}
            sx={{
              margin: "0px 1px",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  border: "none",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  border: "none",
                },
              "& .MuiInputBase-root": {
                padding: "8px 14px",
                display: "flex",
                whiteSpace: "pre-wrap", // 줄바꿈을 유지
                alignItems: "flex-start", // 텍스트가 위쪽에서 시작하도록 설정
                overflowY: "hidden", // 스크롤이 생기지 않게 설정
              },
              "& textarea": {
                lineHeight: "1.5",
                overflow: "hidden", // 스크롤 숨기기
                minHeight: "48px",
                height: "auto", // 자동으로 높이 조절
                boxSizing: "border-box", // padding과 border 고려하여 크기 계산
              },
              "& .MuiInputBase-input": {
                display: "flex",
                alignItems: "flex-start", // 텍스트가 상단에서 시작하도록 설정
                height: "auto", // 자동 높이 조정
                whiteSpace: "pre-wrap", // 줄바꿈을 유지
                textAlign: "left", // 텍스트를 왼쪽 정렬
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
          sx={{
            backgroundColor: "#34495e",
            maxHeight: "40px",
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
          <Box className="comments-list" sx={{ width: "100%" }}>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                className="comment-item"
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: "28px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
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
                        width: "100%",
                      }}
                    >
                      <Typography
                        className="comment-author"
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          marginRight: 1,
                        }}
                      >
                        {comment.author}
                      </Typography>
                      <Box>
                        <Typography
                          className="comment-date"
                          sx={{
                            fontSize: "12px",
                            color: "gray",
                          }}
                        >
                          {formatRelativeTime(comment.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      className="comment-content"
                      sx={{
                        fontSize: "14px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
                {/* 댓글 우측 수정/삭제 메뉴바 시작 */}
                <Box>
                  <Menu commentId={comment.id} fetchComments={fetchComments} />
                </Box>
                {/* 댓글 우측 수정/삭제 메뉴바 끝 */}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  List,
  ListItem,
  Box,
  TextField,
  Button,
  Checkbox,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가

function QuestionDetail() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerContent, setEditedAnswerContent] = useState("");
  const { match } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 사용

  axios.defaults.baseURL = "http://localhost:8080";

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        const id = match;
        const questionResponse = await axios.get(`/api/questions/${id}`);
        const answersResponse = await axios.get(`/api/answers/${id}`);
        setQuestion(questionResponse.data);
        if (questionResponse.data.isRecommended === null) {
          setIsRecommended(false);
        } else if (questionResponse.data.isRecommended === true) {
          setIsRecommended(true);
        }
        setAnswers(answersResponse.data);
        setEditedContent(questionResponse.data.content);
      } catch (error) {
        console.error("Failed to fetch question or answers", error);
      }
    };
    fetchQuestionAndAnswers();
  }, [match]);

  const handleRecommendChange = async (event) => {
    const newIsRecommended = event.target.checked;
    console.log(newIsRecommended);

    // 우선 상태를 먼저 변경
    setIsRecommended(newIsRecommended);

    try {
      const requestData = {
        id: question.id,
        isRecommended: newIsRecommended,
      };

      // DB에 상태 업데이트
      await axios.put(`/api/questions/recommended`, requestData);
    } catch (error) {
      console.error("Failed to update isRecommended", error);
      // 에러 발생 시 상태를 원래대로 되돌림
      setIsRecommended(!newIsRecommended); // 이 부분에서 상태를 이전 값으로 되돌림
    }
  };

  const handleUpdateClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveClick = async () => {
    try {
      const updateQuestion = { ...question, content: editedContent };
      await axios.put(`/api/questions`, updateQuestion);
      setQuestion(updateQuestion);
      setIsEditing(false);
    } catch (error) {
      console.log("Failed to update question", error);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`/api/questions/${question.id}`);
      navigate("/"); // 삭제 후 질문 목록으로 리다이렉트
    } catch (error) {
      console.log("Failed to delete question", error);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!newAnswer.trim()) {
      return;
    }
    try {
      const response = await axios.post("/api/answers", {
        content: newAnswer,
        questionId: question.id,
        userId: 1,
      });
      // 답변을 등록하면 is_solved를 true로 변경
      const updatedQuestion = { ...question, isSolved: true };
      await axios.put(`/api/questions/solved`, updatedQuestion);

      setAnswers((prevAnswers) => [...prevAnswers, response.data]);
      setQuestion(updatedQuestion);
      setNewAnswer("");
    } catch (error) {
      console.log("Failed to submit answer", error);
    }
  };

  const handleAnswerEditClick = (answerId, content) => {
    setEditingAnswerId(answerId);
    setEditedAnswerContent(content);
  };

  const handleAnswerSaveClick = async (answerId) => {
    try {
      const updatedAnswer = { id: answerId, content: editedAnswerContent };
      await axios.put(`/api/answers`, updatedAnswer);
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.id === answerId
            ? { ...answer, content: editedAnswerContent }
            : answer
        )
      );
      setEditingAnswerId(null);
    } catch (error) {
      console.log("Failed to update answer", error);
    }
  };

  const handleAnswerDeleteClick = async (answerId) => {
    try {
      await axios.delete(`/api/answers/${answerId}`);
      setAnswers((prevAnswers) =>
        prevAnswers.filter((answer) => answer.id !== answerId)
      );
    } catch (error) {
      console.log("Failed to delete answer", error);
    }
  };

  const handleChange = (e) => {
    setEditedContent(e.target.value);
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  if (!question) return <div>Loading...</div>;

  return (
    <div>
      <Paper
        style={{
          padding: "20px",
          width: "900px",
          marginLeft: "380px",
          marginBottom: "50px",
        }}
      >
        <Typography
          sx={{
            color: "#333",
            textAlign: "left",
            fontSize: "12px",
            borderBottom: "1px solid #2222",
          }}
        >
          작성 날짜: {new Date(question.createDate).toLocaleDateString()}
          <Checkbox
            checked={isRecommended}
            onChange={handleRecommendChange}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            sx={{
              mt: -5,
              marginLeft: "870px",
            }}
          />
        </Typography>

        {isEditing ? (
          <TextField
            fullWidth
            value={editedContent}
            onChange={handleChange}
            multiline
            minRows={5}
            maxRows={10}
          />
        ) : (
          <Typography sx={{ textAlign: "left", marginTop: "20px" }}>
            {question.content}
          </Typography>
        )}

        <div>
          {isEditing ? (
            <>
              <Button
                onClick={handleSaveClick}
                variant="contained"
                color=""
                sx={{ bottom: "-290px", left: "380px" }}
              >
                저장
              </Button>

              <Button
                onClick={() => setIsEditing(false)}
                variant="contained"
                color=""
                sx={{
                  bottom: "-290px",
                  left: "385px",
                }}
              >
                취소
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleUpdateClick}
                variant="contained"
                color=""
                sx={{ bottom: "-290px", left: "380px" }}
              >
                수정
              </Button>

              <Button
                onClick={() => {
                  if (window.confirm("삭제하시겠습니까?")) {
                    handleDeleteQuestion();
                  }
                }}
                color=""
                variant="contained"
                sx={{
                  bottom: "-290px",
                  left: "385px",
                }}
              >
                삭제
              </Button>
            </>
          )}

          <Typography
            sx={{
              padding: "50px",
              borderBottom: "1px solid",
              borderBottomColor: "#2222",
              marginTop: "200px",
            }}
          ></Typography>
        </div>

        <Typography variant="h6" sx={{ mt: 4, mb: 0, textAlign: "left" }}>
          답변
        </Typography>
        <List>
          {answers.map((answer) => (
            <ListItem
              key={answer.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  강사 {answer.userName}
                </Typography>
                <Typography variant="caption">
                  {new Date(answer.createdAt).toLocaleString()}
                </Typography>
              </Box>

              {editingAnswerId === answer.id ? (
                <TextField
                  fullWidth
                  value={editedAnswerContent}
                  onChange={(e) => setEditedAnswerContent(e.target.value)}
                  multiline
                  minRows={3}
                  maxRows={6}
                />
              ) : (
                <Typography sx={{ textAlign: "left" }}>
                  {answer.content}
                </Typography>
              )}

              {editingAnswerId === answer.id ? (
                <>
                  <Button
                    onClick={() => handleAnswerSaveClick(answer.id)}
                    variant="contained"
                    color=""
                    sx={{ left: "750px" }}
                  >
                    저장
                  </Button>
                  <Button
                    onClick={() => setEditingAnswerId(null)}
                    variant="contained"
                    color=""
                    sx={{ left: "820px", bottom: "37px" }}
                  >
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() =>
                      handleAnswerEditClick(answer.id, answer.content)
                    }
                    color=""
                    variant="contained"
                    sx={{
                      left: "750px",
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    onClick={() => {
                      if (window.confirm("삭제하시겠습니까?")) {
                        handleAnswerDeleteClick(answer.id);
                      }
                    }}
                    color=""
                    variant="contained"
                    sx={{ left: "820px", bottom: "37px" }}
                  >
                    삭제
                  </Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
        <Typography
          sx={{
            borderBottom: "1px solid",
            borderBottomColor: "#2222",
          }}
        ></Typography>
        <Typography variant="h6" sx={{ mt: 4, mb: 2, textAlign: "left" }}>
          답변 작성
        </Typography>
        <TextField
          fullWidth
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="답변을 입력하세요"
          multiline
          minRows={3}
          maxRows={6}
        />
        <Button
          onClick={handleAnswerSubmit}
          variant="contained"
          color=""
          sx={{ mt: 2, right: "-408px" }}
        >
          등록하기
        </Button>
      </Paper>
    </div>
  );
}

export default QuestionDetail;

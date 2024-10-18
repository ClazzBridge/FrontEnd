import React, { useEffect, useState } from "react"; //React, 훅 import
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material"; // MUI 컴포넌트 import
import axios from "axios"; // 데이터 통신용 Axios import
import Pagination from "@mui/material/Pagination"; // 페이지네이션 컴포넌트 import
import { Routes, Route, Link } from "react-router-dom";
import QuestionDetail from "./QuestionDetail";
import { useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getAllPosts } from "../../services/apis/post/get";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  TextField,
  Drawer,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomModal from "../../components/common/CustomModal";
import { savePost } from "../../services/apis/post/post";
import { deletePost as deletePostApi } from "../../services/apis/post/delete";
import {
  saveQuestion,
  saveQuestionApi,
} from "../../services/apis/question/post";
import { deleteQuestionsApi } from "../../services/apis/question/delete";
import { getAllQuestions } from "../../services/apis/question/get";
import apiClient from "../../shared/apiClient";

const columns = [
  { field: "id", headerName: "No", flex: 0.5, resizable: false },
  {
    field: "content",
    flex: 4,
    headerName: "질문",
    resizable: false,
  },
  {
    field: "recommended",
    flex: 1,
    headerName: "추천 여부",
    resizable: false,
  },
  {
    field: "solved",
    headerName: "해결 여부",
    flex: 1,
    resizable: false,
  },
  {
    field: "createdAt",
    flex: 1,
    headerName: "작성날짜",
    resizable: false,
  },
];

export default function QuestionList() {
  const [questions, setQuestions] = useState([]); // 질문 목록 상태
  const [page, setPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태

  const [rows, setRows] = useState([]); // 상태 추가
  const [openDrawer, setOpenDrawer] = useState(false); // Drawer 열기 상태
  const [selectedRow, setSelectedRow] = useState(null); // 선택된 행 데이터
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar 열기 상태
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 추가
  const [memberId, setMemberId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const fetchData = useCallback(async () => {
    const data = await getAllQuestions(); // API 호출
    setRows(data); // 상태 업데이트
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // 컴포넌트 마운트 시 호출

  const handleEditClick = () => {
    setIsEditing(true); // 수정 모드 활성화
  };

  const handleSaveClick = async () => {
    // API 호출하여 수정된 내용을 저장하는 로직 추가
    // await updatePost(selectedRow.id, { title }); // 예시 API 호출
    setIsEditing(false); // 수정 모드 비활성화
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const questionForm = {
    content,
    memberId,
    courseId,
  };

  const getMemberId = () => {
    return "2";
    //return memberId;
  };

  const saveQuestion = async () => {
    await setMemberId("3");
    await setContent("test");
    await setCourseId("1");
    try {
      await saveQuestionApi(questionForm);
      setSnackbarMessage("질문이 성공적으로 저장되었습니다.");
      setOpenSnackbar(true);
      await fetchData();
      closeModal();
      setMemberId("");
      setContent("");
      setCourseId("");
    } catch (error) {
      console.log(error);
      console.error("질문 등록 실패");
      setSnackbarMessage("질문 저장에 실패했습니다.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Snackbar 닫기
  };

  // 체크박스 리스트 받아오기
  const [selectedIds, setSelectedIds] = useState([]); // 선택된 행 ID 상태 추가
  const handleSelectionChange = (newSelection) => {
    setSelectedIds(newSelection); // 선택된 행 ID 업데이트
  };

  const deleteQuestions = async (selectedIds) => {
    try {
      await deleteQuestionsApi(selectedIds);
      setSnackbarMessage("질문이 성공적으로 삭제되었습니다."); // 메시지 설정
      setOpenSnackbar(true); // Snackbar 열기
      await fetchData(); // 데이터 새로 고침
      closeDeleteModal();
      setOpenDrawer(false);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const handleRowClick = (params) => {
    // console.log("Clicked row data:", params.row); // 클릭된 행의 데이터 출력
    setSelectedRow(params.row); // 클릭된 행 데이터 저장
    setOpenDrawer(true); // Drawer 열기
    // 추가 작업 수행 (예: 상세 보기, 편집 등)
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false); // Drawer 닫기
    setSelectedRow(null); // 선택된 행 데이터 초기화
  };

  // 서버로부터 질문 목록을 가져오는 함수 (Axios 사용)
  const fetchQuestions = async (page) => {
    try {
      const response = await apiClient.get(`qnas/questions`);
      setQuestions(response.data.questions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  // 페이지나 다른 의존성이 변경될 때마다 질문 목록을 가져오는 함수 호출
  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          height: "40px",
          gap: "12px",
        }}
      >
        <Button
          variant="outlined"
          sx={{ width: "38px", height: "38px" }}
          onClick={openModal}
        >
          <CreateIcon />
        </Button>
        <Button
          variant="outlined"
          sx={{ width: "38px", height: "38px" }}
          onClick={openDeleteModal}
        >
          <DeleteIcon />
        </Button>
      </Box>
      <CustomModal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal}>
        <Box
          sx={{
            display: "flex",
            margin: "auto",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h3>질문 삭제하기</h3>
          <p>
            {selectedIds.length === 1
              ? "해당 질문을 삭제하시겠습니까?"
              : `${selectedIds.length}개의 질문을 삭제하시겠습니까?`}
          </p>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: "24px",
              margin: "16px 0",
            }}
          >
            <Button
              variant="outlined"
              onClick={closeDeleteModal}
              sx={{ width: "120px", height: "40px" }}
            >
              <CloseIcon />
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                deleteQuestions(selectedIds);
              }}
              sx={{ width: "120px", height: "40px" }}
            >
              <DeleteIcon />
            </Button>
          </Box>
        </Box>
      </CustomModal>
      <CustomModal isOpen={isModalOpen} closeModal={closeModal}>
        <Box
          sx={{
            display: "flex",
            margin: "auto",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h3>질문 작성하기</h3>
          {/* 내용 */}
          <TextField
            fullWidth
            label="내용"
            variant="outlined"
            id="outlined-multiline-static"
            multiline
            rows={14}
            onChange={handleContentChange}
            value={content}
            sx={{ whiteSpace: "pre-wrap" }}
          />
          <Box
            sx={{
              display: "flex",
              margin: "auto",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: "24px",
            }}
          >
            <Button
              variant="outlined"
              onClick={closeModal}
              sx={{ width: "120px", height: "40px" }}
            >
              <CloseIcon />
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={saveQuestion}
              sx={{ width: "120px", height: "40px" }}
            >
              <CreateIcon />
            </Button>
          </Box>
        </Box>
      </CustomModal>

      <Box sx={{ height: "400px", whiteSpace: "100%" }}>
        <DataGrid
          sx={{
            backgroundColor: "white", // 배경색
            border: "none", // 테두리
            "--DataGrid-rowBorderColor": "transparent",
            "& .MuiDataGrid-cell": {
              border: "none",
            },
            "& .MuiDataGrid-row": {
              borderBottom: "1px solid #f6f8fa",
            },
            "& .MuiDataGrid-filler": {
              display: "none",
            },
            "& .MuiDataGrid-footerContainer": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              fontSize: "12px",
              fontWeight: "bold",
              color: "#222831",
            },
            "& .MuiDataGrid-columnSeparator--sideRight": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeader": {
              color: "black", // 헤더 글자색
              border: "none",
            },
          }}
          rows={rows}
          checkboxSelection
          onRowClick={handleRowClick}
          localeText={{
            // 선택된 행 수 텍스트 변경
            footerRowSelected: (count) => `${count}개 선택됨`, // 예: "11개 선택됨"
            // 필터 관련 텍스트 변경
            filterOperatorContains: "포함",
            filterOperatorEquals: "같음",
            filterOperatorStartsWith: "시작함",
            filterOperatorEndsWith: "끝남",
            filterOperatorIs: "이것",
            filterOperatorDoesNotContain: "포함하지 않음",
            filterOperatorDoesNotEqual: "같지 않음",
            filterOperatorIsAnyOf: "다음 중 하나",
            filterOperatorNot: "아니오",
            filterOperatorAfter: "이후",
            filterOperatorBefore: "이전",
            filterOperatorIsEmpty: "비어 있음",
            filterOperatorIsNotEmpty: "비어 있지 않음",

            // 필터 메뉴 텍스트
            filterPanelInputLabel: "필터",
            filterPanelAddFilter: "필터 추가",
            filterPanelDeleteIconLabel: "삭제",
            filterPanelOperator: "연산자",
            filterPanelColumns: "데이터 열",
            filterPanelValue: "값",
            filterPanelOperatorAnd: "그리고",
            filterPanelOperatorOr: "또는",
            sortAscending: "오름차순 정렬",
            sortDescending: "내림차순 정렬",
            columnMenuSortAsc: "오름차순 정렬", // "Sort Ascending" 텍스트 변경
            columnMenuSortDesc: "내림차순 정렬", // "Sort Descending" 텍스트 변경
            columnMenuShowAll: "모두 표시", // "Show All" 텍스트 변경
            columnMenuFilter: "필터", // "Filter" 텍스트 변경
            columnMenuUnsort: "정렬 해제", // "Unsort" 텍스트 변경
            columnMenuHideColumn: "숨기기", // "Hide" 텍스트 변경
            columnMenuHideOn: "숨기기", // "Hide on" 텍스트 변경
            columnMenuManageColumns: "관리", // "Manage" 텍스트 변경
            // 페이지 관련 텍스트 변경
            page: "페이지",
            noRowsLabel: "데이터가 없습니다.",
            noResultsOverlayLabel: "결과가 없습니다.",
            errorOverlayDefaultLabel: "오류가 발생했습니다.",
            // 페이지네이션 관련 텍스트
            pageSize: "페이지 크기",
            pageSizeOptions: ["5", "10", "20"],
          }}
          onRowSelectionModelChange={handleSelectionChange}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Snackbar 컴포넌트 */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          // variant="outlined"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Drawer
        anchor="right" // 오른쪽에서 슬라이드
        open={openDrawer}
        onClose={handleCloseDrawer}
        sx={{ zIndex: 1300 }} // zIndex 설정
      >
        <Box
          sx={{ width: 800, padding: 2 }} // Drawer의 너비 및 패딩 설정
          role="presentation"
          // onClick={handleCloseDrawer} // Drawer 클릭 시 닫기
          onKeyDown={handleCloseDrawer}
        >
          {selectedRow ? (
            <Box sx={{ padding: "28px" }}>
              <Typography
                sx={{
                  color: "gray",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                보드타입
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: "4px",
                }}
              >
                {isEditing ? (
                  <TextField
                    value={selectedRow.title}
                    onChange={(e) => setTitle(e.target.value)} // 제목 상태 업데이트
                    sx={{ fontSize: "30px", fontWeight: "bold", flex: 1 }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontSize: "30px",
                      fontWeight: "bold",
                    }}
                  >
                    타이틀
                  </Typography>
                )}
                <Box sx={{ color: "gray", marginLeft: "10px", width: "116px" }}>
                  <Typography sx={{ fontSize: "12px" }}>
                    작성자: {selectedRow.studentName}
                  </Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    작성날짜: {selectedRow.createdAt}
                  </Typography>
                </Box>
              </Box>
              {/* 선 */}
              <Box
                sx={{
                  borderBottom: "1px solid #d4d4d4",
                  borderBottomWidth: "0.1px",
                  marginBottom: "30px",
                }}
              />

              <Box
                sx={{
                  height: "100%",
                  padding: "24px 0 24px 0",
                  whiteSpace: "pre-wrap",
                }}
              >
                <Typography sx={{ fontSize: "14px" }}>
                  {selectedRow.content}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                {isEditing ? (
                  <Button variant="outlined" onClick={handleSaveClick}>
                    저장
                  </Button>
                ) : (
                  <Button variant="outlined" onClick={handleEditClick}>
                    수정
                  </Button>
                )}
                {isEditing ? (
                  <Button variant="outlined" onClick={setIsEditing(false)}>
                    취소
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedIds([selectedRow.id]);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    삭제
                  </Button>
                )}
              </Box>

              <Box
                sx={{
                  borderBottom: "1px solid #d4d4d4",
                  borderBottomWidth: "0.1px",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              />

              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                댓글 0개
              </Typography>
            </Box>
          ) : (
            <Typography>선택된 게시글이 없습니다.</Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
}

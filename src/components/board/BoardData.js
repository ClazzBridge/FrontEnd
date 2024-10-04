import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { getAllPosts } from "../../services/apis/post/get";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import {
  Box,
  Button,
  TextField,
  Drawer,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomModal from "../common/CustomModal";
import { savePost } from "../../services/apis/post/post";
import { deletePost as deletePostApi } from "../../services/apis/post/delete";

const columns = [
  { field: "id", headerName: "No", flex: 0.5, resizable: false },
  {
    field: "boardType",
    flex: 1,
    headerName: "카테고리",
    resizable: false,
  },
  {
    field: "title",
    flex: 4,
    headerName: "제목",
    resizable: false,
  },
  {
    field: "authorName",
    headerName: "작성자",
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

export default function FreeBoardData() {
  const [rows, setRows] = useState([]); // 상태 추가
  const [openDrawer, setOpenDrawer] = useState(false); // Drawer 열기 상태
  const [selectedRow, setSelectedRow] = useState(null); // 선택된 행 데이터
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar 열기 상태
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchData = useCallback(async () => {
    const data = await getAllPosts(); // API 호출
    setRows(data); // 상태 업데이트
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // 컴포넌트 마운트 시 호출

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const [boardId, setBoardId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleBoardIdChange = (event) => {
    setBoardId(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // 로그인된 유저 데이터 넣어줘야 함!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const postForm = {
    title,
    content,
    boardId,
  };

  const postSave = async () => {
    try {
      await savePost(postForm);
      setSnackbarMessage("게시물이 성공적으로 저장되었습니다."); // 메시지 설정
      setOpenSnackbar(true); // Snackbar 열기
      await fetchData(); // 데이터 새로 고침
      closeModal();
      setBoardId("");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("게시물 등록 실패 ");
      setSnackbarMessage("게시물 저장에 실패했습니다."); // 실패 메시지 설정
      setOpenSnackbar(true); // Snackbar 열기
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

  const deletePost = async (selectedIds) => {
    try {
      await deletePostApi(selectedIds);
      setSnackbarMessage("게시물이 성공적으로 삭제되었습니다."); // 메시지 설정
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
          +
        </Button>
        <Button
          variant="outlined"
          sx={{ width: "38px", height: "38px" }}
          onClick={openDeleteModal}
        >
          -
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
          <h3>게시글 삭제하기</h3>
          <p>
            {selectedIds.length === 1
              ? "해당 게시글을 삭제하시겠습니까?"
              : `${selectedIds.length}개의 게시글을 삭제하시겠습니까?`}
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
              취소
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                deletePost(selectedIds);
              }}
              sx={{ width: "120px", height: "40px" }}
            >
              삭제하기
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
          <h3>게시글 작성하기</h3>
          {/* 카테고리 선택 */}
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">카테고리</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="카테고리"
              onChange={handleBoardIdChange}
              value={boardId}
            >
              <MenuItem value={2}>공지사항</MenuItem>
              <MenuItem value={1}>자유게시판</MenuItem>
            </Select>
          </FormControl>

          {/* 제목 */}
          <TextField
            fullWidth
            id="outlined-basic"
            label="제목"
            variant="outlined"
            onChange={handleTitleChange}
            value={title}
          />

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
              취소
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={postSave}
              sx={{ width: "120px", height: "40px" }}
            >
              등록하기
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
                {selectedRow.boardType}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginBottom: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "30px",
                    fontWeight: "bold",
                  }}
                >
                  {selectedRow.title}
                </Typography>
                <Box sx={{ color: "gray", marginLeft: "10px", width: "116px" }}>
                  <Typography sx={{ fontSize: "12px" }}>
                    작성자: {selectedRow.authorName}
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
                <Button variant="outlined">수정</Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedIds([selectedRow.id]);
                    setIsDeleteModalOpen(true);
                  }}
                >
                  삭제
                </Button>
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

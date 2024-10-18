import { React, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomModal from "./CustomModal";
import { Box, Button, Alert, Snackbar } from "@mui/material";
import { deleteComment } from "../../services/apis/comment/delete";

const options = ["수정", "삭제"];

const ITEM_HEIGHT = 48;

export default function LongMenu({ commentId, fetchComments }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false); // 모달 상태 추가
  const [selectedCommentId, setSelectedCommentId] = useState(null); // 선택된 댓글 ID 상태 추가
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false); // Snackbar 열기 상태
  const [successMessage, setSuccessMessage] = useState("");
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = (id) => {
    setSelectedCommentId(id); // 선택된 댓글 ID 저장
    setOpenModal(true); // 삭제 클릭 시 모달 열기
    handleClose(); // 메뉴 닫기
  };

  const handleModalClose = () => {
    setOpenModal(false); // 모달 닫기
    setSelectedCommentId(null); // 선택된 댓글 ID 초기화
  };

  const deleteComments = async () => {
    try {
      await deleteComment(selectedCommentId);
      handleModalClose();
      setSuccessMessage("댓글이 성공적으로 삭제되었습니다."); // 메시지 설정
      setOpenSuccessSnackbar(true); // Snackbar 열기

      await fetchComments();
    } catch (error) {
      alert("삭제실패");
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setOpenSuccessSnackbar(false);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={
              option === "삭제"
                ? () => handleDeleteClick(commentId)
                : handleClose
            } // 삭제 클릭 시 commentId 전달
          >
            {option}
          </MenuItem>
        ))}
      </Menu>

      {/* 삭제 모달 */}
      <CustomModal isOpen={openModal} closeModal={handleModalClose}>
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
          <h3>댓글 삭제</h3>
          <p>댓글을 완전히 삭제할까요?</p>

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
              onClick={handleModalClose}
              sx={{
                width: "120px",
                height: "40px",
                borderColor: "#34495e",
                color: "#34495e",
              }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                deleteComments();
              }}
              sx={{
                width: "120px",
                height: "40px",
                backgroundColor: "#34495e",
                fontWeight: 600,
              }}
            >
              삭제
            </Button>
          </Box>
        </Box>
      </CustomModal>

      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={2200}
        onClose={handleCloseSuccessSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccessSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import {
  Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";



export default function CustomizedInputBase({question, setQuestion, setQuestionVisible, onSubmit} ) {

  // Dialog 상태 관리
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogAction, setDialogAction] = React.useState('');

  const handleOpenDialog = () => {
    setDialogAction('질문');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogAction('');
    setQuestionVisible(false);
    setQuestion('');
  };

  // 재확인 Dialog의 확인 버튼 핸들러
  const handleConfirmDialog = () => {
    if (dialogAction === '질문') {
      onSubmit();
    }
    handleCloseDialog();  // Dialog 닫기
  };

  return (


      <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, marginBottom: '60px', marginRight:'20px'}}
      >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={question}
            placeholder="질문을 입력하세요."
            onChange={(e) => setQuestion(e.target.value)}
            inputProps={{ 'aria-label': 'search google maps' }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleOpenDialog}>
          <CheckIcon />
        </IconButton>

        {/* 재확인 Dialog */}
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
        >
          <DialogTitle id="dialog-title">
            {'질문을 제출하시겠습니까?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="dialog-description">
              {'입력한 질문을 제출하시겠습니까?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>취소</Button>
            <Button onClick={handleConfirmDialog} autoFocus>확인</Button>
          </DialogActions>
        </Dialog>

      </Paper>


  );
}
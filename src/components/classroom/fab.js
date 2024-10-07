import * as React from 'react';
import Box from '@mui/material/Box';
import BackHandIcon from '@mui/icons-material/BackHand';
import ChatIcon from '@mui/icons-material/Chat';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Slide from '@mui/material/Slide';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import {
    Alert,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    DialogTitle,
    Snackbar
} from '@mui/material';
import { useFabActions } from "../../hooks/useFabActions";
import CustomizedInputBase from "./CustomizedInputBase";
import FabGroup from "./FabGroup";
import {useEffect, useRef} from "react";
import axios from 'axios';
import {pem as jwt} from "node-forge";

export default function FloatingActionButtons() {
    axios.defaults.baseURL = 'http://localhost:8080/';
    const fabRef = useRef(null);  // useRef로 DOM 접근

    useEffect(() => {
        if (fabRef.current) {
            const rect = fabRef.current.getBoundingClientRect();
            console.log(rect);  // 확인용
        }
    }, [fabRef.current]);  // ref가 준비된 이후에만 실행

    const {
        voteVisible,
        questionVisible,
        chatVisible,
        question,
        showFab,
        setVoteVisible,
        setQuestionVisible,
        setChatVisible,
        setQuestion,
    } = useFabActions();

    const [isUnderstand, setUnderstand] = React.useState(false);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });
    const [userId, setUserId] = React.useState(null);
    const [error, setError] = React.useState('');


    // Dialog 상태 관리
    const [openDialog, setOpenDialog] = React.useState(false);
    const [dialogAction, setDialogAction] = React.useState('');

    const handleOpenDialog = (action) => {
        setDialogAction(action);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDialogAction('');
    };

    const handleBeforeSubmitQuestion = () => {
        handleOpenDialog('질문');
    }

    // 질문 제출 핸들러
    const handleSubmitQuestion = async () => {
        try {
            // 요청 데이터 준비
            const questionCreateDTO = {
                content: question,      // 사용자가 입력한 질문 내용
                memberId: 2,              // 실제 userId를 여기에 입력해야 함 (예: 로그인한 사용자 ID)
            };

            console.log("질문 제출:", questionCreateDTO);

            // POST 요청 보내기
            const response = await axios.post('/api/questions', questionCreateDTO, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("서버 응답:", response.data);

            // 성공적으로 제출되었으면 상태를 초기화
            setQuestion("");           // 질문 입력 필드를 초기화
            setQuestionVisible(false); // 질문 제출 폼을 숨김
        } catch (error) {
            console.error("질문 제출 오류:", error.response ? error.response.data : error.message);
        }
    };

    const getUserId = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwt.decode(token);
                setUserId(decodedToken.userId);
            } catch (Error) {
                console.error('Invalid token', error);
            }
        }
    }

    const getUserIdTest = () => {
        setUserId(2);
    }

    // FAB 액션 핸들러
    const handleActionClick = (actionName) => {
        switch (actionName) {
            case '이해 완료':
                setUnderstand(false);
                setSnackbar({ open: true, message: '이해 미완료로 설정되었습니다.', severity: 'error' });
                getUserIdTest();
                axios.put("/api/student-status/understanding", {
                    "memberId": userId,
                    "isUnderstanding": false
                })
                break;
            case '이해 안됨':
                setUnderstand(true);
                setSnackbar({ open: true, message: '이해 완료로 설정되었습니다.', severity: 'success' });
                getUserIdTest();
                axios.put("/api/student-status/understanding", {
                    "memberId": userId,
                    "isUnderstanding": true
                })
                break;
            case '질문':
                setQuestionVisible(!questionVisible);
                break;
            case '손 들기':
                handleOpenDialog(actionName);
                break;
            case '채팅':
                setChatVisible(true);
                break;
            case 'CloseQuestionInput':
                console.log(22);
                setQuestionVisible(false);
                break;
            default:
                break;
        }
    };

    // 재확인 Dialog의 확인 버튼 핸들러
    const handleConfirmDialog = () => {
        if (dialogAction === '손 들기') {
            setSnackbar({open: true, message: '손을 들었습니다.', severity: 'info'});
            getUserIdTest();
            axios.put("/api/student-status/hand-raised", {
                "memberId": userId,
                "isHandRaised": true
            });
        }
        handleCloseDialog();  // Dialog 닫기
    };

    // Snackbar 닫기 핸들러
    const handleCloseSnackbar = (event, reason) => {
        if (reason !== 'clickaway') {
            setSnackbar({ ...snackbar, open: false });
        }
    };

    return (
        <Box sx={{
            position: 'fixed',
            right: '0',
            height: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0px',
            alignItems: 'center'
        }}>
            {/* 질문 입력창 */}
            {questionVisible && (
                <CustomizedInputBase question={question} setQuestion={setQuestion} setQuestionVisible={setQuestionVisible} onSubmit={handleSubmitQuestion} />
            )}

            {/* 막대 바 */}
            {!showFab && (
                <Slide in={!showFab} direction='left'>
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        flexDirection: 'column',
                        paddingBottom: '0px',
                        paddingRight: '0px'
                    }}>
                        <Box
                            sx={{
                                width: '13px',
                                height: '100px',
                                bgcolor: 'lightgrey',
                                borderRadius: '0px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <KeyboardDoubleArrowLeftIcon sx={{
                                fontSize: '15px',
                                marginBottom: '10px',
                                color: 'gray'
                            }} />
                        </Box>
                    </Box>
                </Slide>
            )}

            {/* 투표 UI */}
            {voteVisible && (
                <Box sx={{
                    position: 'absolute',
                    bottom: 80,
                    right: 16
                }}>
                    <Button onClick={() => setVoteVisible(false)}>
                        <ThumbUpIcon /> 찬성
                    </Button>
                    <Button onClick={() => setVoteVisible(false)}>
                        <ThumbDownIcon /> 반대
                    </Button>
                </Box>
            )}

            {/* Snackbar */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbar.open}
                autoHideDuration={1000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="outlined"
                    sx={{ width: '100%', marginTop: '50px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* 채팅창 모달 */}
            <Modal
                open={chatVisible}
                onClose={() => setChatVisible(false)}
                aria-labelledby="chat-modal-title"
                aria-describedby="chat-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4 }}>
                    <h2 id="chat-modal-title">채팅창</h2>
                    <p id="chat-modal-description">여기에 채팅 내용을 표시하세요</p>
                    <Button onClick={() => setChatVisible(false)}>닫기</Button>
                </Box>
            </Modal>

            {/* FAB 그룹 */}
            {showFab && (
                <Slide in={true} direction='left'>
                    <div ref={fabRef}> {/* ref로 DOM 요소에 접근 */}
                        <FabGroup
                            actions={[
                                isUnderstand ? { icon: <PsychologyIcon />, name: '이해 완료' } : { icon: <PsychologyAltIcon />, name: '이해 안됨' },
                                { icon: <QuestionAnswerIcon />, name: '질문' },
                                { icon: <BackHandIcon />, name: '손 들기' },
                                { icon: <ChatIcon />, name: '채팅' },
                            ]}
                            onClick={handleActionClick}
                        />
                    </div>
                </Slide>
            )}

            {/* 재확인 Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle id="dialog-title">
                    {'손을 드시겠습니까?'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        {'이 동작은 손을 드는 것을 의미하며, 다른 사람들이 이를 볼 수 있습니다.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>취소</Button>
                    <Button onClick={handleConfirmDialog} autoFocus>확인</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
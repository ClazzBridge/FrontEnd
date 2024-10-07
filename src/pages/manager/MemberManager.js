import React, { useState } from "react";
import { Button, Modal, Typography, TextField, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const MemberManager = () => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // 폼 입력 상태 관리
    const [newEventName, setNewEventName] = useState('');
    const [newEventMemberId, setNewEventMemberId] = useState('');
    const [newEventPassword, setNewEventPassword] = useState('');
    const [newEventPhone, setNewEventPhone] = useState('');
    const [newEventEmail, setNewEventEmail] = useState('');
    const [newEventTitle, setNewEventTitle] = useState('');

    const [events, setEvents] = useState([]);
    const [visiblePasswords, setVisiblePasswords] = useState({}); // 비밀번호 가리기 상태

    // 폼 초기화
    const resetForm = () => {
        setNewEventName('');
        setNewEventMemberId('');
        setNewEventPassword('');
        setNewEventPhone('');
        setNewEventEmail('');
        setNewEventTitle('');
    };

    // 모달 열기 및 닫기
    const handleOpen = () => {
        setEditMode(false);
        setSelectedEvent(null);
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    // 이벤트 추가 핸들러
    const handleSaveEvent = () => {
        const newMember = {
            name: newEventName,
            memberId: newEventMemberId,
            password: newEventPassword,
            phone: newEventPhone,
            email: newEventEmail,
            courseTitle: newEventTitle,
        };

        // 새로 등록된 회원에 대해 비밀번호를 가리도록 설정
        setVisiblePasswords((prevState) => ({
            ...prevState,
            [newMember.memberId]: false, // 비밀번호 기본적으로 가리기
        }));

        if (editMode) {
            // 업데이트 로직
            const updatedEvents = events.map((event) =>
                event.memberId === selectedEvent.memberId ? { ...event, ...newMember } : event
            );
            setEvents(updatedEvents);
        } else {
            // 신규 등록
            setEvents([...events, newMember]);
        }

        handleClose();
    };

    // 비밀번호 가리기/보이기 토글 핸들러
    const togglePasswordVisibility = (memberId) => {
        setVisiblePasswords((prevState) => ({
            ...prevState,
            [memberId]: !prevState[memberId], // 클릭된 memberId의 상태를 토글
        }));
    };

    return (
        <div>
            {/* 회원 리스트 테이블 */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>선택</TableCell>
                        <TableCell>이름</TableCell>
                        <TableCell>아이디</TableCell>
                        <TableCell>비밀번호</TableCell>
                        <TableCell>전화번호</TableCell>
                        <TableCell>이메일</TableCell>
                        <TableCell>강의명</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Checkbox
                                    checked={false} // 선택 상태 관리 필요
                                    onChange={() => { }}
                                />
                            </TableCell>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{event.memberId}</TableCell>
                            <TableCell>
                                <span>
                                    {visiblePasswords[event.memberId] ? event.password : "••••••••"} {/* 비밀번호 보이기/가리기 */}
                                </span>
                                <IconButton
                                    onClick={() => togglePasswordVisibility(event.memberId)}
                                    aria-label="toggle password visibility"
                                    edge="end"
                                >
                                    {visiblePasswords[event.memberId] ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </TableCell>
                            <TableCell>{event.phone}</TableCell>
                            <TableCell>{event.email}</TableCell>
                            <TableCell>{event.courseTitle}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* 등록 버튼 */}
            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    회원 등록
                </Button>
            </Box>

            {/* 모달 */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        p: 4,
                        backgroundColor: "white",
                        borderRadius: "8px",
                        maxWidth: "600px",
                        margin: "auto",
                        top: "20%",
                        position: "relative",
                    }}
                >
                    <Typography id="modal-title" variant="h6">
                        {editMode ? "회원 수정" : "회원 등록"}
                    </Typography>

                    {/* 입력 필드 */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <TextField
                            label="이름"
                            value={newEventName}
                            onChange={(e) => setNewEventName(e.target.value)}
                        />
                        <TextField
                            label="아이디"
                            value={newEventMemberId}
                            onChange={(e) => setNewEventMemberId(e.target.value)}
                        />
                        <TextField
                            label="비밀번호"
                            type="password"
                            value={newEventPassword}
                            onChange={(e) => setNewEventPassword(e.target.value)}
                        />
                        <TextField
                            label="전화번호"
                            value={newEventPhone}
                            onChange={(e) => setNewEventPhone(e.target.value)}
                        />
                        <TextField
                            label="이메일"
                            value={newEventEmail}
                            onChange={(e) => setNewEventEmail(e.target.value)}
                        />
                        <FormControl variant="outlined">
                            <InputLabel>강의명</InputLabel>
                            <Select
                                label="강의명"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                            >
                                <MenuItem value="Course 1">Course 1</MenuItem>
                                <MenuItem value="Course 2">Course 2</MenuItem>
                                <MenuItem value="Course 3">Course 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* 저장 및 취소 버튼 */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleSaveEvent}>
                            저장
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleClose} sx={{ ml: 2 }}>
                            취소
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default MemberManager;
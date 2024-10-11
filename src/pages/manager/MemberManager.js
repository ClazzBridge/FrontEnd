import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, TextField, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import apiClient from '../../shared/apiClient';

const MemberManager = () => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedMembers, setSelectedMembers] = useState([]); // 선택한 회원 상태 관리

    // 폼 입력 상태 관리
    const [newEventId, setNewEventId] = useState(''); // ID 추가
    const [newEventName, setNewEventName] = useState('');
    const [newEventMemberId, setNewEventMemberId] = useState('');
    const [newEventPassword, setNewEventPassword] = useState('');
    const [newEventPhone, setNewEventPhone] = useState('');
    const [newEventEmail, setNewEventEmail] = useState('');
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventType, setNewEventType] = useState('수강생');

    const [events, setEvents] = useState([]);
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기 상태 관리
    const [courseOption, setCourseOption] = useState([]); // 강의명 목록 상태

    useEffect(() => {
        // 페이지가 처음 로드될 때 API에서 데이터를 가져옵니다.
        fetchEvents();
        fetchCourse();
    }, []); // 빈 배열로 처음에 한 번만 실행

    const fetchEvents = () => {
        apiClient.get('user')
            .then(response => {
                const fetchedEvents = response.data.map(event => ({
                    ...event,
                }));
                setEvents(fetchedEvents); // 3. 상태 업데이트
            })
            .catch(error => {
                console.error('이벤트 데이터를 불러오지 못했습니다.', error);
            });
    };

    const fetchCourse = () => {
        // 강의명 목록을 가져오는 API 호출
        apiClient.get('course/title')
            .then(response => {
                setCourseOption(response.data); // 강의명 목록 설정
            })
            .catch(error => {
                console.error('강의명 목록을 불러오지 못했습니다.', error);
            });
    };

    // 폼 초기화
    const resetForm = () => {
        setNewEventName('');
        setNewEventMemberId('');
        setNewEventPassword('');
        setNewEventPhone('');
        setNewEventEmail('');
        setNewEventTitle('');
        setNewEventType('수강생');
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

    // 신규 회원 추가
    const addMember = (newMember) => {
        apiClient.post('user', newMember) // ID 없이 회원 추가
            .then(response => {
                setEvents([...events, response.data]); // 응답으로 받은 새 회원 추가
                alert('회원이 추가되었습니다.');
                console.log(newMember);
                handleClose();
                fetchEvents(); // 추가 후 이벤트 목록 새로 고침
            })
            .catch(error => {
                console.error('회원 추가에 실패했습니다.', error);
            });
    };

    // 기존 회원 수정
    const updateMember = (updatedMember) => {
        apiClient.put('user', updatedMember) // ID 포함하여 수정
            .then(response => {
                const updatedEvents = events.map(event =>
                    event.id === selectedEvent.id ? { ...event, ...updatedMember } : event
                );
                setEvents(updatedEvents);
                alert('회원 정보가 수정되었습니다.');
                handleClose();
                fetchEvents(); // 수정 후 이벤트 목록 새로 고침
            })
            .catch(error => {
                console.log(updatedMember);
                console.error('회원 수정에 실패했습니다.', error);
            });
    };

    // 이벤트 추가 또는 업데이트 핸들러
    const handleSaveEvent = () => {
        const newMember = {
            id: newEventId,
            name: newEventName,
            memberId: newEventMemberId,
            password: newEventPassword,
            phone: newEventPhone,
            email: newEventEmail,
            courseTitle: newEventTitle,
            memberType: newEventType,
        };

        if (editMode) {
            // 수정
            updateMember(newMember); // ID를 전달
        } else {
            // 추가
            addMember(newMember);
        }
    };

    // 회원 삭제 핸들러
    const deleteSelectedMembers = () => {
        // 선택된 회원 수를 확인
        const memberCount = selectedMembers.length;

        if (memberCount === 0) {
            alert("삭제할 회원을 선택하세요");
            return;
        }

        const confirmation = window.confirm(`선택된 회원 ${memberCount}명을 삭제하시겠습니까?`); // window.confirm 팝업창

        if (confirmation) {
            const deletePromises = selectedMembers.map(id => {
                console.log("Deleting member with ID:", id); // 삭제할 memberId 확인
                return apiClient.delete(`user/${id}`);
            });

            Promise.all(deletePromises)
                .then(() => {
                    const updatedEvents = events.filter(event => !selectedMembers.includes(event.id));
                    setEvents(updatedEvents);
                    setSelectedMembers([]); // 선택한 회원 목록 초기화
                    alert("회원 삭제 성공");
                })
                .catch(error => {
                    console.error('회원 정보를 삭제하지 못했습니다.', error.response.data);
                    alert('회원 삭제 실패: ' + error.response.data.message); // 서버에서 받은 오류 메시지를 출력
                });
        } else {
            // 사용자가 삭제를 취소했을 때의 처리
            return;
        }
    };

    // 회원 수정 핸들러
    const editSelectedMember = () => {
        if (selectedMembers.length !== 1) {
            alert('수정할 회원은 하나만 선택해야 합니다.');
            return;
        }

        const memberToEdit = events.find(event => event.id === selectedMembers[0]);
        if (memberToEdit) {
            setSelectedEvent(memberToEdit);
            setNewEventId(memberToEdit.id);
            setNewEventName(memberToEdit.name);
            setNewEventMemberId(memberToEdit.memberId);
            setNewEventPassword(memberToEdit.password);
            setNewEventPhone(memberToEdit.phone);
            setNewEventEmail(memberToEdit.email);
            setNewEventTitle(memberToEdit.courseTitle);
            setNewEventType(memberToEdit.memberType);
            setEditMode(true);
            setOpen(true);
        }
    };

    // 체크박스 선택/해제 핸들러
    const handleSelectMember = (memberId) => {
        setSelectedMembers((prevSelected) =>
            prevSelected.includes(memberId)
                ? prevSelected.filter(id => id !== memberId) // 선택 해제
                : [...prevSelected, memberId] // 선택 추가
        );
    };

    // 비밀번호 가리기/보이기 토글 핸들러
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getMemberType = (role) => {
        if (role === 'ROLE_STUDENT') return '수강생';
        if (role === 'ROLE_TEACHER') return '강사';
        return role; // 다른 역할이 있을 경우 그대로 출력
    };

    return (
        <div>
            {/* 회원 리스트 테이블 */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>선택</TableCell>
                        <TableCell>번호</TableCell>
                        <TableCell>회원종류</TableCell>
                        <TableCell>이름</TableCell>
                        <TableCell>아이디</TableCell>
                        <TableCell>전화번호</TableCell>
                        <TableCell>이메일</TableCell>
                        <TableCell>강의명</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ paddingLeft: '8px' }}>
                                <Checkbox
                                    checked={selectedMembers.includes(event.id)}
                                    onChange={() => handleSelectMember(event.id)}
                                    sx={{ m1: -10 }}
                                />
                            </TableCell>
                            <TableCell>{event.id}</TableCell>
                            <TableCell>{getMemberType(event.memberType)}</TableCell>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{event.memberId}</TableCell>
                            <TableCell>{event.phone}</TableCell>
                            <TableCell>{event.email}</TableCell>
                            <TableCell>{event.courseTitle}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* 등록, 수정, 삭제 버튼 */}
            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2 }}>
                    회원 등록
                </Button>
                <Button variant="contained" color="secondary" onClick={editSelectedMember} sx={{ mr: 2 }}>
                    회원 수정
                </Button>
                <Button variant="contained" color="error" onClick={deleteSelectedMembers}>
                    회원 삭제
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
                        // disabled={editMode} // 수정 모드에서는 아이디 수정 불가
                        />
                        <Box sx={{ display: "grid" }}>
                            <TextField
                                fullwidth
                                label="비밀번호"
                                type={showPassword ? "text" : "password"} // 상태에 따라 변경
                                value={newEventPassword}
                                onChange={(e) => setNewEventPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton
                                            onClick={togglePasswordVisibility}
                                            aria-label="toggle password visibility"
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    ),
                                }}
                            />
                        </Box>
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
                                {courseOption.map((course, index) => (
                                    <MenuItem key={index} value={course.courseTitle}>
                                        {course.courseTitle}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* 라디오 버튼: 회원 종류 선택 */}
                        <FormControl component="fieldset">
                            <Typography>회원 종류</Typography>
                            <RadioGroup
                                row
                                value={newEventType}
                                onChange={(e) => setNewEventType(e.target.value)}
                            >
                                {/* 수정 모드에서는 회원 종류 수정 불가 */}
                                <FormControlLabel value="ROLE_STUDENT" control={<Radio />} label="수강생" disabled={editMode} />
                                <FormControlLabel value="ROLE_TEACHER" control={<Radio />} label="강사" disabled={editMode} />
                            </RadioGroup>
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
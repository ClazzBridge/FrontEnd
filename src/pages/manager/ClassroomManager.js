import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, TextField, Box, FormControl, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import apiClient from '../../shared/apiClient';

const ClassroomManager = () => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedClassrooms, setSelectedClassrooms] = useState([]); // 선택한 강의실 상태 관리

    // 폼 입력 상태 관리
    const [newEventId, setNewEventId] = useState(''); // ID 추가
    const [newEventName, setNewEventName] = useState('');
    const [newEventIsOccupied, setNewEventIsOccupied] = useState('');

    const [events, setEvents] = useState([]);

    // 에러 상태 관리
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        // 페이지가 처음 로드될 때 API에서 데이터를 가져옵니다.
        fetchEvents();
    }, []); // 빈 배열로 처음에 한 번만 실행

    const fetchEvents = () => {
        apiClient.get('classroom')
            .then(response => {
                const fetchedEvents = response.data.map(event => ({
                    ...event,
                }));
                console.log("1. ==============>" , response.data);
                setEvents(fetchedEvents); // 3. 상태 업데이트
            })
            .catch(error => {
                console.error('이벤트 데이터를 불러오지 못했습니다.', error);
            });
    };

    const getClassroomType = (isOccupied) => {
        if (isOccupied === false) return '사용 안함';
        if (isOccupied === true) return '사용중';
    };

    //const validateName = (name) => {
    //    if (name.length < 2 || name.includes(" ")) {
    //        setNameError("2글자 이상이거나 공백이 들어가면 안됩니다.");
    //        return;
    //    } else {
    //        setNameError('');
    //    }
    //};

    // 폼 초기화
    const resetForm = () => {
        setNewEventName('');
        setNewEventIsOccupied('');
        setNameError('');
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

    // 신규 강의실 추가
    const addClassroom = (newClassroom) => {
        apiClient.post('classroom', newClassroom) // ID 없이 강의실 추가
            .then(response => {
                setEvents([...events, response.data]); // 응답으로 받은 새 강의실 추가
                alert('강의실이 추가되었습니다.');
                console.log(newClassroom);
                handleClose();
                fetchEvents(); // 추가 후 이벤트 목록 새로 고침
            })
            .catch(error => {
                console.log('1----->', newClassroom);
                console.error('강의실 추가에 실패했습니다.', error);
            });
    };

    // 기존 강의실 수정
    const updateClassroom = (updatedClassroom) => {
        apiClient.put('classroom', updatedClassroom) // ID 포함하여 수정
            .then(response => {
                const updatedEvents = events.map(event =>
                    event.id === selectedEvent.id ? { ...event, ...updatedClassroom } : event
                );
                setEvents(updatedEvents);
                alert('강의실 정보가 수정되었습니다.');
                handleClose();
                fetchEvents(); // 수정 후 이벤트 목록 새로 고침
            })
            .catch(error => {
                console.log(updatedClassroom);
                console.error('강의실 수정에 실패했습니다.', error);
            });
    };

    // 이벤트 추가 또는 업데이트 핸들러
    const handleSaveEvent = () => {
        const newClassroom = {
            id: newEventId,
            name: newEventName,
            isOccupied: newEventIsOccupied,
        };

        const existingClassroom = events.find(event => event.name === newEventName && (!editMode || event.id !== newEventId));

        if (existingClassroom) {
            alert("이미 등록된 강의실입니다.");
            return;
        }

        if (editMode) {
            // 수정
            updateClassroom(newClassroom); // ID를 전달
        } else {
            // 추가
            addClassroom(newClassroom);
        }
    };

    // 강의실 삭제 핸들러
    const deleteSelectedClassrooms = () => {
        // 선택된 강의실 수를 확인
        const classroomCount = selectedClassrooms.length;

        if (classroomCount === 0) {
            alert("삭제할 강의실을 선택하세요");
            return;
        }

        const confirmation = window.confirm(`선택된 강의실 ${classroomCount}개를 삭제하시겠습니까?`); // window.confirm 팝업창

        if (confirmation) {
            const deletePromises = selectedClassrooms.map(id => {
                console.log("Deleting Classroom with ID:", id); // 삭제할 memberId 확인
                return apiClient.delete(`classroom/${id}`);
            });

            Promise.all(deletePromises)
                .then(() => {
                    const updatedEvents = events.filter(event => !selectedClassrooms.includes(event.id));
                    setEvents(updatedEvents);
                    setSelectedClassrooms([]); // 선택한 강의실 목록 초기화
                    alert(`${classroomCount}개 강의실 삭제 성공`);
                })
                .catch(error => {
                    console.error('강의실 정보를 삭제하지 못했습니다.', error.response.data);
                    alert('강의실 삭제 실패: ' + error.response.data.message); // 서버에서 받은 오류 메시지를 출력
                });
        } else {
            // 사용자가 삭제를 취소했을 때의 처리
            return;
        }
    };

    // 강의실 수정 핸들러
    const editSelectedClassroom = () => {
        if (selectedClassrooms.length !== 1) {
            alert('수정할 강의실은 하나만 선택해야 합니다.');
            return;
        }

        const classroomToEdit = events.find(event => event.id === selectedClassrooms[0]);
        if (classroomToEdit) {
            setSelectedEvent(classroomToEdit);
            setNewEventId(classroomToEdit.id);
            setNewEventName(classroomToEdit.name);
            setNewEventIsOccupied(classroomToEdit.isOccupied)
        
            setEditMode(true);
            setOpen(true);
        }
    };

    // 체크박스 선택/해제 핸들러
    const handleSelectClassroom = (classroomId) => {
        setSelectedClassrooms((prevSelected) =>
            prevSelected.includes(classroomId)
                ? prevSelected.filter(id => id !== classroomId) // 선택 해제
                : [...prevSelected, classroomId] // 선택 추가
        );
    };

    return (
        <div>
            {/* 강의실 리스트 테이블 */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>선택</TableCell>
                        <TableCell>번호</TableCell>
                        <TableCell>강의실명</TableCell>
                        <TableCell>점유여부</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {events.map((event, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ paddingLeft: '8px' }}>
                                <Checkbox
                                    checked={selectedClassrooms.includes(event.id)}
                                    onChange={() => handleSelectClassroom(event.id)}
                                    sx={{ m1: -10 }}
                                />
                            </TableCell>
                            <TableCell>{event.id}</TableCell>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{getClassroomType(event.isOccupied)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* 등록, 수정, 삭제 버튼 */}
            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2 }}>
                    강의실 등록
                </Button>
                <Button variant="contained" color="secondary" onClick={editSelectedClassroom} sx={{ mr: 2 }}>
                    강의실 수정
                </Button>
                <Button variant="contained" color="error" onClick={deleteSelectedClassrooms}>
                    강의실 삭제
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
                        {editMode ? "강의실 수정" : "강의실 등록"}
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
                            label="강의실명"
                            value={newEventName}
                            onChange={(e) => {
                                setNewEventName(e.target.value);
                                //validateName(e.target.value);
                            }}
                            error={!!nameError}
                            helperText={nameError}
                        />
                        {/* 라디오 버튼: 점유여부 선택 */}
                        <FormControl component="fieldset">
                            <Typography>점유 여부</Typography>
                            <RadioGroup
                                row
                                value={newEventIsOccupied}
                                onChange={(e) => setNewEventIsOccupied(e.target.value)}
                            >
                                <FormControlLabel value='true' control={<Radio />} label="사용중" disabled={!editMode} />
                                <FormControlLabel value="false" control={<Radio />} label="사용 안함" disabled={!editMode} />
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

export default ClassroomManager;
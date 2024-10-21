import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, TextField, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import moment from 'moment';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import apiClient from '../../shared/apiClient';

const CourseManager = () => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]); // 선택한 강의 상태 관리

    // 폼 입력 상태 관리
    const [newEventClassroom, setNewEventClassroom] = useState('');
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventStart, setNewEventStart] = useState(moment());
    const [newEventEnd, setNewEventEnd] = useState(moment().add(1, 'hour'));
    const [newEventLayoutImageUrl, setNewEventLayoutImageUrl] = useState('');

    const [events, setEvents] = useState([]);
    const [classroomOption, setClassroomOption] = useState([]); // 강의실 목록 상태

    // 에러 상태 관리

    useEffect(() => {
        // 페이지가 처음 로드될 때 API에서 데이터를 가져옵니다.
        fetchEvents();
        fetchClassroom();
    }, []); // 빈 배열로 처음에 한 번만 실행

    const fetchEvents = () => {
        apiClient.get('course')
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

    const fetchClassroom = () => {
        // 강의실 목록을 가져오는 API 호출
        apiClient.get('classroom/name')
            .then(response => {
                setClassroomOption(response.data); // 강의실 목록 설정
            })
            .catch(error => {
                console.log(setClassroomOption);
                console.error('강의실 목록을 불러오지 못했습니다.', error);
            });
    };

    // 폼 초기화
    const resetForm = () => {
        setNewEventClassroom('');
        setNewEventTitle('');
        setNewEventDescription('');
        setNewEventStart(moment());
        setNewEventEnd(moment().add(1, 'hour'));
        setNewEventLayoutImageUrl('');
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

    // 신규 강의 추가
    const addCourse = (newCourse) => {
        apiClient.post('course', newCourse) // ID 없이 강의 추가
            .then(response => {
                setEvents([...events, response.data]); // 응답으로 받은 새 강의 추가
                alert('강의가 추가되었습니다');
                handleClose();
                fetchEvents(); // 추가 후 이벤트 목록 새로 고침
            })
            .catch(error => {
                console.log(newCourse);
                console.error('강의 추가에 실패했습니다.', error);
            });
    };

    // 기존 강의 수정
    const updateCourse = (updatedCourse) => {
        apiClient.put('course', updatedCourse) // ID 포함하여 수정
            .then(response => {
                const updatedEvents = events.map(event =>
                    event.id === selectedEvent.id ? { ...event, ...updatedCourse } : event
                );
                setEvents(updatedEvents);
                alert('강의 정보가 수정되었습니다.');
                handleClose();
                fetchEvents(); // 수정 후 이벤트 목록 새로 고침
            })
            .catch(error => {
                console.error('강의 수정에 실패했습니다.', error);
            });
    };

    // 이벤트 추가 또는 업데이트 핸들러
    const handleSaveEvent = () => {
        const newCourse = {
            classroomName: newEventClassroom,
            title: newEventTitle,
            description: newEventDescription,
            startDate: newEventStart.format("YYYY-MM-DD"),
            endDate: newEventEnd.format("YYYY-MM-DD"),
            layoutImageUrl: newEventLayoutImageUrl,
        };

        if (editMode) {
            // 수정
            updateCourse(newCourse); // ID없이 강의 추가
        } else {
            // 추가
            addCourse(newCourse);
        }
    };

    // 강의 삭제 핸들러
    const deleteSelectedCourse = () => {
        // 선택된 강의 수를 확인
        const courseCount = selectedCourses.length;

        if (courseCount === 0) {
            alert("삭제할 강의를 선택하세요.");
            return;
        }

        const confirmation = window.confirm(`선택된 강의 ${courseCount}개를 삭제하시겠습니까?`); // window.confirm 팝업창

        if (confirmation) {
            const deletePromises = selectedCourses.map(id => {
                console.log("Deleting course with ID:", id); // 삭제할 courseId 확인
                return apiClient.delete(`course/${id}`);
            });

            Promise.all(deletePromises)
                .then(() => {
                    const updatedEvents = events.filter(event => !selectedCourses.includes(event.id));
                    setEvents(updatedEvents);
                    setSelectedCourses([]); // 선택한 강의 목록 초기화
                    alert(`${courseCount}개의 강의 삭제 성공`);
                })
                .catch(error => {
                    console.error('강의 정보를 삭제하지 못했습니다.', error.response.data);
                    alert('강의 삭제 실패: ' + error.response.data.message); // 서버에서 받은 오류 메시지를 출력
                });
        } else {
            // 사용자가 삭제를 취소했을 때의 처리
            return;
        }
    };

    // 강의 수정 핸들러
    const editSelectedCourse = () => {
        if (selectedCourses.length !== 1) {
            alert('수정할 강의는 하나만 선택해야 합니다.');
            return;
        }

        const courseToEdit = events.find(event => event.id === selectedCourses[0]);
        if (courseToEdit) {
            setSelectedEvent(courseToEdit);
            setNewEventClassroom(courseToEdit.classroomName);
            setNewEventTitle(courseToEdit.courseTitle);
            setNewEventDescription(courseToEdit.description);
            setNewEventStart(courseToEdit.startDate);
            setNewEventEnd(courseToEdit.EndDate);
            setNewEventLayoutImageUrl(courseToEdit.layoutImageUrl);
            setEditMode(true);
            setOpen(true);
        }
    };

    // 체크박스 선택/해제 핸들러
    const handleSelectCourse = (courseId) => {
        setSelectedCourses((prevSelected) =>
            prevSelected.includes(courseId)
                ? prevSelected.filter(id => id !== courseId) // 선택 해제
                : [...prevSelected, courseId] // 선택 추가
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div>
                {/* 강의 리스트 테이블 */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>선택</TableCell>
                            <TableCell>번호</TableCell>
                            <TableCell>강사명</TableCell>
                            <TableCell>강의실명</TableCell>
                            <TableCell>강의명</TableCell>
                            <TableCell>설명</TableCell>
                            <TableCell>시작 날짜</TableCell>
                            <TableCell>종료 날짜</TableCell>
                            <TableCell>좌석 배치도</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ paddingLeft: '8px' }}>
                                    <Checkbox
                                        checked={selectedCourses.includes(event.id)}
                                        onChange={() => handleSelectCourse(event.id)}
                                        sx={{ m1: -10 }}
                                    />
                                </TableCell>
                                <TableCell>{event.id}</TableCell>
                                <TableCell>{event.instructor}</TableCell>
                                <TableCell>{event.classroomName}</TableCell>
                                <TableCell>{event.title}</TableCell>
                                <TableCell>{event.description}</TableCell>
                                <TableCell>{event.startDate}</TableCell>
                                <TableCell>{event.endDate}</TableCell>
                                <TableCell>{event.layoutImageUrl}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* 등록, 수정, 삭제 버튼 */}
                <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2 }}>
                        강의 등록
                    </Button>
                    <Button variant="contained" color="secondary" onClick={editSelectedCourse} sx={{ mr: 2 }}>
                        강의 수정
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteSelectedCourse}>
                        강의 삭제
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
                            <Box sx={{ display: "grid" }}>
                                <TextField
                                    fullwidth
                                    label="강의명"
                                    value={newEventTitle}
                                    onChange={(e) => {
                                        setNewEventTitle(e.target.value);
                                    }}
                                />
                            </Box>
                            <FormControl variant="outlined">
                                <InputLabel>강의실명</InputLabel>
                                <Select
                                    label="강의실명"
                                    value={newEventClassroom}
                                    onChange={(e) => setNewEventClassroom(e.target.value)}
                                >
                                    {classroomOption.map((course, index) => (
                                        <MenuItem key={index} value={course.classroomName}>
                                            {course.classroomName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box sx={{ display: "grid" }}>
                                <TextField
                                    fullwidth
                                    label="설명"
                                    value={newEventDescription}
                                    onChange={(e) => {
                                        setNewEventDescription(e.target.value);
                                    }}
                                />
                            </Box>
                            <DatePicker
                                label="시작 날짜"
                                value={newEventStart}
                                onChange={(newValue) => setNewEventStart(moment(newValue))}
                                renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />}
                            />
                            <br />
                            <br />
                            <DatePicker
                                label="종료 날짜"
                                value={newEventEnd}
                                onChange={(newValue) => setNewEventEnd(moment(newValue))}
                                renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />}
                            />
                        </Box>
                        <Box sx={{ display: "grid" }}>
                            <TextField
                                fullwidth
                                label="좌석 배치 url"
                                value={newEventLayoutImageUrl}
                                onChange={(e) => {
                                    setNewEventLayoutImageUrl(e.target.value);
                                }}
                            />
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
        </LocalizationProvider>
    );
};

export default CourseManager;

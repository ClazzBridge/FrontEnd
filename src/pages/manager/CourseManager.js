import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, TextField, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import apiClient from '../../shared/apiClient';
import { DataGrid } from '@mui/x-data-grid'; // DataGrid 임포트
import { v4 as uuidv4 } from 'uuid'; // 고유한 ID를 생성하기 위해 uuid 패키지 사용
import moment from 'moment';

const CourseManager = () => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedCourses, setselectedCourses] = useState([]); // 선택한 강의 상태 관리

    // 폼 입력 상태 관리
    const [newEventId, setNewEventId] = useState(''); // ID 추가
    const [newEventInstructor, setnewEventInstructor] = useState('');
    const [newTitle, setnewTitle] = useState('');
    const [newDescription, setnewDescription] = useState('');
    const [newStartDate, setnewStartDate] = useState('');
    const [newEndDate, setnewEndDate] = useState('');
    const [newClassroomName, setnewClassroomName] = useState('');
    const [newLayoutImageUrl, setnewLayoutImageUrl] = useState('');

    const [events, setEvents] = useState([]);
    const [courseOption, setCourseOption] = useState([]); // 강의명 목록 상태

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
        // 강의명 목록을 가져오는 API 호출
        apiClient.get('classroom/name')
            .then(response => {
                setCourseOption(response.data); // 강의명 목록 설정
                console.log(response.data);
            })
            .catch(error => {
                console.error('강의명 목록을 불러오지 못했습니다.', error);
            });
    };

    // 폼 초기화
    const resetForm = () => {
        setnewEventInstructor('');
        setnewTitle('');
        setnewDescription('');
        setnewStartDate('');
        setnewEndDate('');
        setnewClassroomName('');
        setnewLayoutImageUrl('');
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
    const addMember = (newCourse) => {
        apiClient.post('course', newCourse) // ID 없이 강의 추가
            .then(response => {
                const addedCourse = {
                    ...response.data,
                    id: response.data.id || uuidv4(), // 서버가 `id`를 주지 않으면 클라이언트에서 임시로 생성
                };
                setEvents([...events, addedCourse]);// 응답으로 받은 새 강의 추가
                alert('강의이 추가되었습니다.');
                handleClose();
                fetchEvents(); // 추가 후 이벤트 목록 새로 고침
            })
            .catch(error => {

                console.error('강의 추가에 실패했습니다.', error);
            });
    };

    // 기존 강의 수정
    const updateMember = (updateCourse) => {
        apiClient.put('course', updateCourse) // ID 포함하여 수정
            .then(response => {
                const updatedEvents = events.map(event =>
                    event.id === selectedEvent.id ? { ...event, ...updateCourse } : event
                );
                setEvents(updatedEvents);
                alert('강의 정보가 수정되었습니다.');
                handleClose();
                fetchEvents(); // 수정 후 이벤트 목록 새로 고침
            })
            .catch(error => {
                console.log(updateCourse.id);
                console.error('강의 수정에 실패했습니다.', error);
            });
    };

    const handleSaveEvent = () => {
        const newCourse = {
            id: editMode ? newEventId : undefined,  // 수정 모드일 때만 ID 포함
            title: newTitle,
            description: newDescription,
            startDate: moment(newStartDate).format('YYYY-MM-DD'),
            endDate: moment(newEndDate).format('YYYY-MM-DD'),
            classroomName: newClassroomName,
            layoutImageUrl: newLayoutImageUrl
        };

        // 모든 필수 값이 채워졌는지 확인
        if (newTitle.length === 0 || newDescription.length === 0 ||
            newStartDate.length === 0 || newEndDate.length === 0 ||
            newClassroomName.length === 0) {
            alert("입력하지 않은 값이 있습니다.");
            return;
        }

        // 수정 모드일 때 기존 데이터 수정
        if (editMode) {
            updateMember(newCourse); // ID를 포함하여 수정
        } else {
            addMember(newCourse); // ID 없이 새로운 강의 추가
        }
    };

    // 강의 삭제 핸들러
    const deleteselectedCourses = () => {
        // 선택된 강의 수를 확인
        const memberCount = selectedCourses.length;

        if (memberCount === 0) {
            alert("삭제할 강의을 선택하세요");
            return;
        }

        const confirmation = window.confirm(`선택된 강의 ${memberCount}명을 삭제하시겠습니까?`); // window.confirm 팝업창

        if (confirmation) {
            const deletePromises = selectedCourses.map(id => {
                console.log("Deleting member with ID:", id); // 삭제할 memberId 확인
                return apiClient.delete(`course/${id}`);
            });

            Promise.all(deletePromises)
                .then(() => {
                    const updatedEvents = events.filter(event => !selectedCourses.includes(event.id));
                    setEvents(updatedEvents);
                    setselectedCourses([]); // 선택한 강의 목록 초기화
                    alert(`${memberCount}명의 강의 삭제 성공`);
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
    const editSelectedMember = () => {
        if (selectedCourses.length !== 1) {
            alert('수정할 강의은 하나만 선택해야 합니다.');
            return;
        }

        const courseToEdit = events.find(event => event.id === selectedCourses[0]);
        if (courseToEdit) {
            setSelectedEvent(courseToEdit);
            setNewEventId(courseToEdit.id);
            setnewEventInstructor(courseToEdit.instuctor);
            setnewTitle(courseToEdit.title);
            setnewDescription(courseToEdit.description);
            setnewStartDate(courseToEdit.StartDate);
            setnewEndDate(courseToEdit.EndDate);
            setnewClassroomName(courseToEdit.classroomName);
            setnewLayoutImageUrl(courseToEdit.LayoutImageUrl);
            setEditMode(true);
            setOpen(true);
        }
    };



    return (
        <div>
            {/* 강의 리스트 테이블 */}

            <Box sx={{ height: 650, width: '100%' }}>
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
                    rows={events} // 데이터


                    columns={[
                        { field: 'id', headerName: '번호', flex: 0.5 },
                        { field: 'instructor', headerName: '강사', flex: 1 },
                        { field: 'title', headerName: '강의명', flex: 1.5 },
                        { field: 'description', headerName: '설명', flex: 1.3 },
                        { field: 'startDate', headerName: '시작날짜', flex: 1.3 },
                        { field: 'endDate', headerName: '종료날짜', flex: 1.3 },
                        { field: 'classroomName', headerName: '강의실', flex: 1.5, ml: 30 },
                        { field: 'layoutImageUrl', headerName: '배치도', flex: 1.3 },
                    ]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10]}
                    checkboxSelection // 행 선택을 위한 체크박스 추가
                    onRowSelectionModelChange={(newSelection) => {
                        setselectedCourses(newSelection); // 상태 업데이트

                    }}

                    selectionModel={selectedCourses} // 선택된 ID 목록
                />
            </Box>





            {/* 등록, 수정, 삭제 버튼 */}
            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={handleOpen} sx={{ mr: 2 }}>
                    강의 등록
                </Button>
                <Button variant="outlined" onClick={editSelectedMember} sx={{ mr: 2 }}>
                    강의 수정
                </Button>
                <Button variant="outlined" onClick={deleteselectedCourses}>
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
                        {editMode ? "강의 수정" : "강의 등록"}
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
                        {/* <TextField
                            label="강사 이름"
                            value={newEventInstructor}
                            onChange={(e) => {
                                setnewEventInstructor(e.target.value);
                            }}
                        /> */}
                        <TextField
                            label="강의명"
                            value={newTitle}
                            onChange={(e) => {
                                setnewTitle(e.target.value);

                            }}

                        />
                        <FormControl variant="outlined">
                            <InputLabel>강의실</InputLabel>
                            <Select
                                label="강의실명"
                                value={newClassroomName}
                                onChange={(e) => setnewClassroomName(e.target.value)}
                            >
                                {courseOption.map((classroom, index) => (
                                    <MenuItem key={index} value={classroom.classroomName}>
                                        {classroom.classroomName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            type="date"
                            value={newStartDate}
                            onChange={(e) => {
                                setnewStartDate(e.target.value);

                            }}

                        />
                        <TextField
                            type="date"
                            value={newEndDate}
                            onChange={(e) => {
                                setnewEndDate(e.target.value);
                            }}

                        />

                        <Box sx={{ display: "grid", gridColumn: "span 2" }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="설명"
                                value={newDescription}
                                onChange={(e) => setnewDescription(e.target.value)}
                                sx={{ width: "100%" }}
                            />
                        </Box>
                        <Box sx={{ display: "grid", gridColumn: "span 2" }}>
                            <TextField
                                fullWidth
                                value={newLayoutImageUrl}
                                label="배치도"
                                onChange={(e) => {
                                    setnewLayoutImageUrl(e.target.value);
                                }}
                                sx={{ width: "100%" }}
                            />
                        </Box>
                    </Box>

                    {/* 저장 및 취소 버튼 */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button variant="outlined" onClick={handleSaveEvent}>
                            저장
                        </Button>
                        <Button variant="outlined" onClick={handleClose} sx={{ ml: 2 }}>
                            취소
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default CourseManager;
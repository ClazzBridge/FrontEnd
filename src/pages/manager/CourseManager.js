import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, TextField, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import moment from 'moment';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import apiClient from '../../shared/apiClient';

const CourseManager = () => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedCourses, setSelectedCourses] = useState([]); // ������ ���� ���� ����

    // �� �Է� ���� ����
    const [newEventId, setNewEventId] = useState(''); // ID �߰�
    const [newEventInstructor, setNewEventInstructor] = useState('');
    const [newEventClassroom, setNewEventClassroom] = useState('');
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDescription, setNewEventDescription] = useState('');
    const [newEventStart, setNewEventStart] = useState(moment());
    const [newEventEnd, setNewEventEnd] = useState(moment().add(1, 'hour'));
    const [newEventLayoutImageUrl, setNewEventLayoutImageUrl] = useState('');

    const [events, setEvents] = useState([]);
    const [courseOption, setCourseOption] = useState([]); // ���Ǹ� ��� ����

    // ���� ���� ����
    const [nameError, setNameError] = useState('');

    //const validateName = (name) => {
    //    if (name.length < 2 || name.includes(" ")) {
    //        setNameError("2���� �̻��̰ų� ������ ���� �ȵ˴ϴ�.");
    //        return;
    //    } else {
    //        setNameError('');
    //    }
    //};

    useEffect(() => {
        // �������� ó�� �ε�� �� API���� �����͸� �����ɴϴ�.
        fetchEvents();
        fetchCourse();
    }, []); // �� �迭�� ó���� �� ���� ����

    const fetchEvents = () => {
        apiClient.get('course')
            .then(response => {
                const fetchedEvents = response.data.map(event => ({
                    ...event,
                }));
                setEvents(fetchedEvents); // 3. ���� ������Ʈ
            })
            .catch(error => {
                console.error('�̺�Ʈ �����͸� �ҷ����� ���߽��ϴ�.', error);
            });
    };

    const fetchCourse = () => {
        // ���Ǹ� ����� �������� API ȣ��
        apiClient.get('course/title')
            .then(response => {
                setCourseOption(response.data); // ���Ǹ� ��� ����
            })
            .catch(error => {
                console.error('���Ǹ� ����� �ҷ����� ���߽��ϴ�.', error);
            });
    };

    // �� �ʱ�ȭ
    const resetForm = () => {
        setNewEventInstructor('');
        setNewEventClassroom('');
        setNewEventTitle('');
        setNewEventDescription('');
        setNewEventStart(moment());
        setNewEventEnd(moment().add(1, 'hour'));
        setNewEventLayoutImageUrl('');
        setNameError('');
    };

    // ��� ���� �� �ݱ�
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

    // �ű� ���� �߰�
    const addCourse = (newCourse) => {
        apiClient.post('course', newCourse) // ID ���� ���� �߰�
            .then(response => {
                setEvents([...events, response.data]); // �������� ���� �� ���� �߰�
                alert('���ǰ� �߰��Ǿ����ϴ�.');
                handleClose();
                fetchEvents(); // �߰� �� �̺�Ʈ ��� ���� ��ħ
            })
            .catch(error => {
                console.error('���� �߰��� �����߽��ϴ�.', error);
            });
    };

    // ���� ȸ�� ����
    const updateCourse = (updatedCourse) => {
        apiClient.put('course', updatedCourse) // ID �����Ͽ� ����
            .then(response => {
                const updatedEvents = events.map(event =>
                    event.id === selectedEvent.id ? { ...event, ...updatedCourse } : event
                );
                setEvents(updatedEvents);
                alert('���� ������ �����Ǿ����ϴ�.');
                handleClose();
                fetchEvents(); // ���� �� �̺�Ʈ ��� ���� ��ħ
            })
            .catch(error => {
                console.error('���� ������ �����߽��ϴ�.', error);
            });
    };

    // �̺�Ʈ �߰� �Ǵ� ������Ʈ �ڵ鷯
    const handleSaveEvent = () => {
        const newCourse = {
            id: newEventId,
            instructor: newEventInstructor,
            classroom: newEventClassroom,
            title: newEventTitle,
            description: newEventDescription,
            startDate: newEventStart.format("YYYY-MM-DD HH:mm"),
            endDate: newEventEnd.format("YYYY-MM-DD HH:mm"),
            layoutImageUrl: newEventLayoutImageUrl,
        };

        if (editMode) {
            // ����
            updateCourse(newCourse); // ID�� ����
        } else {
            // �߰�
            addCourse(newCourse);
        }
    };

    // ȸ�� ���� �ڵ鷯
    const deleteSelectedCourse = () => {
        // ���õ� ȸ�� ���� Ȯ��
        const courseCount = selectedCourses.length;

        if (courseCount === 0) {
            alert("������ ���Ǹ� �����ϼ���");
            return;
        }

        const confirmation = window.confirm(`���õ� ���� ${courseCount}���� �����Ͻðڽ��ϱ�?`); // window.confirm �˾�â

        if (confirmation) {
            const deletePromises = selectedCourses.map(id => {
                console.log("Deleting course with ID:", id); // ������ courseId Ȯ��
                return apiClient.delete(`course/${id}`);
            });

            Promise.all(deletePromises)
                .then(() => {
                    const updatedEvents = events.filter(event => !selectedCourses.includes(event.id));
                    setEvents(updatedEvents);
                    setSelectedCourses([]); // ������ ���� ��� �ʱ�ȭ
                    alert(`${courseCount}���� ���� ���� ����`);
                })
                .catch(error => {
                    console.error('���� ������ �������� ���߽��ϴ�.', error.response.data);
                    alert('���� ���� ����: ' + error.response.data.message); // �������� ���� ���� �޽����� ���
                });
        } else {
            // ����ڰ� ������ ������� ���� ó��
            return;
        }
    };

    // ȸ�� ���� �ڵ鷯
    const editSelectedCourse = () => {
        if (selectedCourses.length !== 1) {
            alert('������ ���Ǵ� �ϳ��� �����ؾ� �մϴ�.');
            return;
        }

        const courseToEdit = events.find(event => event.id === selectedCourses[0]);
        if (courseToEdit) {
            setSelectedEvent(courseToEdit);
            setNewEventId(courseToEdit.id);
            setNewEventInstructor(courseToEdit.name);
            setNewEventClassroom(courseToEdit.memberId);
            setNewEventTitle(courseToEdit.courseTitle);
            setNewEventDescription(courseToEdit.description);
            setNewEventStart(courseToEdit.startDate);
            setNewEventEnd(courseToEdit.EndDate);
            setNewEventLayoutImageUrl(courseToEdit.layoutImageUrl);
            setEditMode(true);
            setOpen(true);
        }
    };

    // üũ�ڽ� ����/���� �ڵ鷯
    const handleSelectCourse = (courseId) => {
        setSelectedCourses((prevSelected) =>
            prevSelected.includes(courseId)
                ? prevSelected.filter(id => id !== courseId) // ���� ����
                : [...prevSelected, courseId] // ���� �߰�
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div>
                {/* ȸ�� ����Ʈ ���̺� */}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>����</TableCell>
                            <TableCell>��ȣ</TableCell>
                            <TableCell>�����</TableCell>
                            <TableCell>���ǽǸ�</TableCell>
                            <TableCell>���Ǹ�</TableCell>
                            <TableCell>����</TableCell>
                            <TableCell>���۳�¥</TableCell>
                            <TableCell>���ᳯ¥</TableCell>
                            <TableCell>�¼���ġ��</TableCell>
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
                                <TableCell>{event.classroom}</TableCell>
                                <TableCell>{event.title}</TableCell>
                                <TableCell>{event.description}</TableCell>
                                <TableCell>{event.startDate}</TableCell>
                                <TableCell>{event.endDate}</TableCell>
                                <TableCell>{event.layoutImageUrl}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* ���, ����, ���� ��ư */}
                <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mr: 2 }}>
                        ���� ���
                    </Button>
                    <Button variant="contained" color="secondary" onClick={editSelectedCourse} sx={{ mr: 2 }}>
                        ���� ����
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteSelectedCourse}>
                        ���� ����
                    </Button>
                </Box>

                {/* ��� */}
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
                            {editMode ? "���� ����" : "���� ���"}
                        </Typography>

                        {/* �Է� �ʵ� */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <TextField
                                label="�����"
                                value={newEventInstructor}
                                onChange={(e) => {
                                    setNewEventInstructor(e.target.value);
                                }}
                                error={!!nameError}
                                helperText={nameError}
                            />
                            <TextField
                                label="���ǽǸ�"
                                value={newEventClassroom}
                                onChange={(e) => {
                                    setNewEventClassroom(e.target.value);
                                }}
                            />
                            <FormControl variant="outlined">
                                <InputLabel>���Ǹ�</InputLabel>
                                <Select
                                    label="���Ǹ�"
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
                            <Box sx={{ display: "grid" }}>
                                <TextField
                                    fullwidth
                                    label="����"
                                    value={newEventDescription}
                                    onChange={(e) => {
                                        setNewEventDescription(e.target.value);
                                    }}
                                />
                            </Box>
                            <DateTimePicker
                                label="���� ��¥"
                                value={newEventStart}
                                onChange={(newValue) => setNewEventStart(moment(newValue))}
                                renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />}
                            />
                            <br />
                            <br />
                            <DateTimePicker
                                label="���� ��¥"
                                value={newEventEnd}
                                onChange={(newValue) => setNewEventEnd(moment(newValue))}
                                renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />}
                            />
                        </Box>

                        {/* ���� �� ��� ��ư */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                            <Button variant="contained" color="primary" onClick={handleSaveEvent}>
                                ����
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleClose} sx={{ ml: 2 }}>
                                ���
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </LocalizationProvider>
    );
};

export default CourseManager;

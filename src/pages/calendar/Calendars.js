import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Button, Modal, Typography, TextField, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const Calendars = () => {
  // 모달 상태 관리
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // 폼 입력 상태 관리
  const [newEventClassroomName, setNewEventClassroomName] = useState('');
  const [newEventEventTitle, setNewEventEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventStart, setNewEventStart] = useState(moment());
  const [newEventEnd, setNewEventEnd] = useState(moment().add(1, 'hour'));

  const [events, setEvents] = useState([]);

  useEffect(() => {
    // 페이지가 처음 로드될 때 API에서 데이터를 가져옵니다.
    fetchEvents();
  }, []); // 빈 배열로 처음에 한 번만 실행

  const fetchEvents = () => {
    const token = localStorage.getItem('accessToken'); // 1. 로컬 스토리지에서 토큰 가져오기

    axios.get('http://localhost:8080/api/schedule/find', {
      headers: {
        Authorization: `Bearer ${token}` // 2. 토큰을 Authorization 헤더에 추가
      }
    })
      .then(response => {
        const fetchedEvents = response.data.map(event => ({
          ...event,
          start: moment(event.startDate, "YYYY-MM-DD HH:mm").toDate(),
          end: moment(event.endDate, "YYYY-MM-DD HH:mm").toDate(),
        }));
        setEvents(fetchedEvents); // 3. 상태 업데이트
      })
      .catch(error => {
        console.error('이벤트 데이터를 불러오지 못했습니다.', error);
      });
  };


  // 일정 추가 핸들러
  const handleAddEvent = () => {
    setIsAddingEvent(true);
    setSelectedEvent(null);
    setOpen(true);
    setEditMode(true);
    setNewEventClassroomName('');
    setNewEventEventTitle('');
    setNewEventDescription('');
    setNewEventStart(moment());
    setNewEventEnd(moment().add(1, 'hour'));
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setIsAddingEvent(false);
    setEditMode(false);
    setNewEventClassroomName('');
    setNewEventEventTitle('');
    setNewEventDescription('');
    setNewEventStart(moment());
    setNewEventEnd(moment().add(1, 'hour'));
  };

  // 이벤트 클릭 시 이벤트 처리
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEventClassroomName(event.classroomName);
    setNewEventEventTitle(event.eventTitle);
    setNewEventDescription(event.description);
    setNewEventStart(moment(event.startDate));
    setNewEventEnd(moment(event.endDate));
    setIsAddingEvent(false);
    setOpen(true);
    setEditMode(false);
  };

  // 이벤트 수정 핸들러
  const handleEditEvent = () => {
    setEditMode(true);
  };

  // 이벤트 저장 핸들러
  const handleSaveEvent = () => {
    const newEvent = {
      id: selectedEvent ? selectedEvent.id : null,
      classroomName: newEventClassroomName,
      eventTitle: newEventEventTitle,
      description: newEventDescription,
      startDate: newEventStart.format("YYYY-MM-DD HH:mm"), // 포맷된 문자열로 변환
      endDate: newEventEnd.format("YYYY-MM-DD HH:mm"),     // 포맷된 문자열로 변환
    };

    if (editMode) {
      if (isAddingEvent) {
        // 새로운 이벤트 추가
        axios.post('http://localhost:8080/api/schedule/add', newEvent)
          .then(response => {
            const savedEvent = {
              ...newEvent,
              id: response.data.id, // 서버에서 받은 id로 업데이트
              start: newEventStart.toDate(), // moment 객체를 JS Date 객체로 변환
              end: newEventEnd.toDate() // moment 객체를 JS Date 객체로 변환
            };

            // 이벤트 목록에 새로 추가된 이벤트 반영
            setEvents([...events, savedEvent]);
            alert('일정이 추가되었습니다.');
            handleClose(); // 모달 닫기
            fetchEvents();
          })
          .catch(error => {
            alert('강의실명이 안 맞습니다.');
            console.error('일정 추가에 실패하였습니다.', error);
          });
      } else {
        // 기존 이벤트 수정
        axios.put('http://localhost:8080/api/schedule/update', newEvent)
          .then(() => {
            const updatedEvents = events.map(event =>
              event.id === selectedEvent.id ? { ...event, ...newEvent } : event
            );
            setEvents(updatedEvents);
            alert('일정이 수정되었습니다.');
            handleClose(); // 모달 닫기
            fetchEvents();
          })
          .catch(error => {
            alert('강의실명이 안 맞습니다.');
            console.error('일정 수정에 실패하였습니다.', error);
          });
      }
    }
  };

  // 이벤트 삭제 핸들러
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      axios.delete(`http://localhost:8080/api/schedule/delete/${selectedEvent.id}`)
        .then(() => {
          const filteredEvents = events.filter(event => event.id !== selectedEvent.id);
          setEvents(filteredEvents);
          alert('일정이 삭제되었습니다.');
          handleClose(); // 모달 닫기
          fetchEvents();
        })
        .catch(error => {
          console.error('일정 삭제에 실패하였습니다.', error);
        });
    }
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div style={{ height: '80vh' }}>
        <Button variant="outlined" color="secondary" onClick={handleAddEvent} style={{ marginBottom: '10px' }}>
          일정 추가
        </Button>

        <Calendar
          localizer={localizer}
          events={events.map(event => ({
            ...event,
            title: event.eventTitle,
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
        />

        <Modal
          open={open}
          onClose={handleClose}
          aria-label="model-classroomName"
          aria-labelledby="modal-eventTitle"
          aria-describedby="modal-description"
        >
          <div style={{
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            maxWidth: '400px',
            margin: 'auto',
            top: '30%',
            position: 'relative',
          }}>
            {editMode ? (
              <>
                <Typography id="modal-eventTitle" variant="h6">
                  {isAddingEvent ? '새 일정 추가' : '이벤트 수정'}
                </Typography>
                <TextField
                  fullWidth
                  label="강의실"
                  value={newEventClassroomName}
                  onChange={(e) => setNewEventClassroomName(e.target.value)}
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  fullWidth
                  label="제목"
                  value={newEventEventTitle}
                  onChange={(e) => setNewEventEventTitle(e.target.value)}
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  fullWidth
                  label="설명"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  style={{ marginBottom: '20px' }}
                />

                <DateTimePicker
                  label="시작 날짜"
                  value={newEventStart}
                  onChange={(newValue) => setNewEventStart(moment(newValue))}
                  renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />}
                />
                <DateTimePicker
                  label="종료 날짜"
                  value={newEventEnd}
                  onChange={(newValue) => setNewEventEnd(moment(newValue))}
                  renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />}
                />
              </>
            ) : (
              <>
                <Typography id="modal-classroomName" variant="h6">
                  {selectedEvent ? selectedEvent.classroomName : ''}
                </Typography>
                <Typography id="modal-eventTitle" variant="h6">
                  {selectedEvent ? selectedEvent.eventTitle : ''}
                </Typography>
                <Typography id="modal-description">
                  {selectedEvent ? selectedEvent.description : ''}
                </Typography>
                <Typography>
                  시작 시간: {selectedEvent ? moment(selectedEvent.start).format('YYYY.MM.DD HH:mm') : ''}
                </Typography>
                <Typography>
                  종료 시간: {selectedEvent ? moment(selectedEvent.end).format('YYYY.MM.DD HH:mm') : ''}
                </Typography>

                <div style={{ marginTop: '20px' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditEvent}
                    style={{ marginRight: '10px' }}
                  >
                    변경
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleDeleteEvent}
                  >
                    삭제
                  </Button>
                </div>
              </>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              {editMode && (
                <Button onClick={handleSaveEvent} color="primary" variant="contained" sx={{ mr: 1 }}>
                  저장
                </Button>
              )}
              <Button onClick={handleClose} color="secondary" variant="contained">
                닫기
              </Button>
            </Box>
          </div>
        </Modal>
      </div>
    </LocalizationProvider>
  );
};

export default Calendars;
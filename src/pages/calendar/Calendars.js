import React, { useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Button, Modal, Typography, TextField } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'; // MUI의 DateTimePicker
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const localizer = momentLocalizer(moment); // moment.js를 캘린더의 날짜 로컬라이저로 설정합니다.

export default function Calendars() {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // 폼 입력 필드 상태 관리
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventStart, setNewEventStart] = useState(moment()); // moment로 초기화
  const [newEventEnd, setNewEventEnd] = useState(moment().add(1, 'hour')); // moment로 초기화

  const [events, setEvents] = useState([]);

  const handleAddEvent = () => {
    setIsAddingEvent(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
    setIsAddingEvent(false);

    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventStart(moment()); // moment로 초기화
    setNewEventEnd(moment().add(1, 'hour')); // moment로 초기화
  };

  const handleSaveEvent = () => {
    const newEvent = {
      title: newEventTitle,
      description: newEventDescription,
      start: newEventStart.toDate(), // 반드시 Date 객체로 변환
      end: newEventEnd.toDate(),     // 반드시 Date 객체로 변환
    };
    setEvents([...events, newEvent]);

    setNewEventTitle(''); // 입력 필드 초기화
    setNewEventDescription(''); // 입력 필드 초기화
    setNewEventStart(moment()); // moment 객체로 초기화
    setNewEventEnd(moment().add(1, 'hour')); // moment 객체로 초기화
    handleClose(); // 모달 닫기
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}> {/* 날짜/시간 선택을 위해 MUI LocalizationProvider 추가 */}
      <div style={{ height: '80vh' }}>
        {/* 일정 추가 버튼 */}
        <Button variant="outlined" color="secondary" onClick={handleAddEvent}>
          일정 추가
        </Button>

        {/* Big Calendar 컴포넌트 */}
        <Calendar
          localizer={localizer}
          events={events.map(event => ({
            ...event,
            start: new Date(event.start), // 반드시 Date 객체로 변환
            end: new Date(event.end),     // 반드시 Date 객체로 변환
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
        />

        {/* 모달 컴포넌트 */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
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
            {isAddingEvent ? (
              <>

                {/* 새로운 일정 추가 폼 */}
                <Typography id="modal-title" variant="h6">일정 추가</Typography>
                <TextField
                  fullWidth
                  variant="filled"
                  label="강의실"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="제목"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  style={{ marginBottom: '20px' }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  label="설명"
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  style={{ marginBottom: '20px' }}
                />

                {/* 시작 날짜 선택 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <DateTimePicker
                    label="시작 날짜"
                    value={newEventStart}
                    onChange={(newValue) => setNewEventStart(moment(newValue))}
                    renderInput={(params) => <TextField {...params} fullWidth style={{ marginBottom: '20px' }} />} // 여기서 marginBottom 추가
                  />
                  <br></br>

                  <DateTimePicker
                    label="종료 날짜"
                    value={newEventEnd}
                    onChange={(newValue) => setNewEventEnd(moment(newValue))}
                    renderInput={(params) => <TextField {...params} fullWidth />} // marginBottom을 없애거나 다른 방식으로 조정
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' }}>
                  <Button variant="contained" color="primary" onClick={handleSaveEvent}>
                    저장
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleClose}>
                    닫기
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Typography id="modal-title" variant="h6">
                  {selectedEvent ? selectedEvent.title : ''}
                </Typography>
                <Typography id="modal-description">
                  {selectedEvent ? selectedEvent.description : 'My Description'}
                </Typography>
              </>
            )}

          </div>
        </Modal>
      </div>
    </LocalizationProvider>
  );
}
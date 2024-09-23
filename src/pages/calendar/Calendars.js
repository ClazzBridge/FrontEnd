import React, { useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Button, Modal, Typography } from '@mui/material';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from "axios";

const localizer = momentLocalizer(moment);

export default function Calendars() {
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const events = [
    { title: 'Event 1', start: new Date(), end: new Date() },
    { title: 'test', start: new Date(), end: new Date() }
  ];

  return (
    <div style={{ height: '80vh' }}>
      <Button variant="outlined" color="secondary">Create Event</Button>
      <Calendar
        localizer={localizer}
        events={events}
        onSelectEvent={handleSelectEvent}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: '100%'
        }}
      />

      < Modal
        open={open}
        onClose={handleClose}
        aria- labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '8px',
          maxWidth: '400px', // 최대 너비 설정
          margin: 'auto', // 중앙 정렬
          top: '30%', // 수직 중앙 조정
          position: 'relative', // position 설정

        }}>
          <Typography id="modal-title" variant="h6">
            {selectedEvent ? selectedEvent.title : ''}
          </Typography>
          <Typography id="modal-description">
            My Description
          </Typography>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    </div >
  );
}

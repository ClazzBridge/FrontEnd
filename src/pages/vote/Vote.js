import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, TextField, Box, FormControl, InputLabel, Select, MenuItem, IconButton, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import moment from 'moment';
import apiClient from '../../shared/apiClient';
import { DataGrid } from '@mui/x-data-grid'; // DataGrid 임포트
import CustomSnackbar from "../../components/common/CustomSnackbar"; // 커스텀 스낵바

const Vote = () => {
	const [open, setOpen] = useState('');
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [selectedVotes, setSelectedVotes] = useState([]); // 선택한 투표 상태 관리

	// 폼 입력 상태 관리
	const [newEventId, setNewEventId] = useState(''); 
	const [newEventCourse, setNewEventCourse] = useState('');
	const [newEventTitle, setNewEventTitle] = useState('');
	const [newEventDescription, setNewEventDescription] = useState('');
	const [newEventStart, setNewEventStart] = useState(moment());
	const [newEventEnd, setNewEventEnd] = useState(moment().add(1, 'hour'));

	const [events, setEvents] = useState('');

	const [openSnackbar, setOpenSnackbar] = useState(false); // 스낵바 열기 상태
	const [snackbarMessage, setSnackbarMessage] = useState(""); // 스낵바 메시지
	const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 스낵바 성공/실패 유무
	const handleCloseSnackbar = () => {
		setOpenSnackbar(false); // 스낵바 닫기
	};

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = () => {
		apiClient.get('vote')
			.then(response => {
				const fetchedEvents = response.data.map((event) => ({
					...event,
				}));
				setEvents(fetchedEvents); // 상태 업데이트
			})
			.catch(error => {
				console.error('이벤트 데이터를 불러오지 못했습니다.', error);
			});
	};

	const fetchCourse = () => {
		apiClient.get('course')
	}



};
export default Vote;
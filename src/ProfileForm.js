import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MuiTelInput } from 'mui-tel-input'
import {
    Button,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    TextField,
    Box,
    Typography,
    Container,
    CssBaseline,
    Alert,
} from "@mui/material";

const ProfileForm = ({ userId }) => { // userId를 props로 받음
    const [profile, setProfile] = useState({
        name: '',
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        gitUrl: '',
        bio: ''
    });

    const [error, setError] = useState(''); // 비밀번호 불일치 등의 에러 메시지를 저장
    const [phoneError, setPhoneError] = useState(""); // 전화번호 불일치 에러 메시지 저장

    useEffect(() => {
        if (userId) {
            // 토큰을 로컬 스토리지에서 가져옴
            const token = localStorage.getItem('token');

            axios.get(`http://localhost:8080/userlist/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // 헤더에 토큰 추가
                }
            })
                .then(response => {
                    setProfile(response.data); // 가져온 데이터를 프로필 상태로 설정
                })
                .catch(error => {
                    console.error('Error fetching profile', error);
                });
        }
    }, [userId]);

    // 이메일 유효성 검사용 정규식
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 전화번호 유효성 검사용 정규식 (한국 전화번호)
    const phonePattern = /^\+82\s\d{2,3}-\d{3,4}-\d{4}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevState => {
            const updatedProfile = { ...prevState, [name]: value };
            let newError = '';
            if ((name === 'password' || name === 'confirmPassword') && updatedProfile.password !== updatedProfile.confirmPassword) {
                newError = '비밀번호가 일치하지 않습니다.';
            } else if (name === 'email' && !emailPattern.test(value)) {
                newError = '올바른 이메일 형식이 아닙니다.';
            }
            setError(newError);
            return updatedProfile;
        });
    };

    const handlePhoneChange = (newValue) => {
        setProfile(prevState => ({ ...prevState, phone: newValue }));
        const phonePattern = /^\+82\d{9,11}$/;
        if (!phonePattern.test(newValue)) {
            setPhoneError('올바른 전화번호 형식이 아닙니다.');
        } else {
            setPhoneError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (profile.password !== profile.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!emailPattern.test(profile.email)) {
            setError('올바른 이메일 형식이 아닙니다.');
            return;
        }
        if (phoneError) {
            return;
        }
        axios.post('http://localhost:8080/userlist/update', profile)
            .then(response => {
                alert('변경되었습니다.');
            })
            .catch(error => {
                console.error('변경에 실패하였습니다.', error);
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    프로필 수정
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="이름"
                        name="name"
                        value={profile.name || ""}  // null 값을 방지하기 위해 빈 문자열로 대체
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="아이디"
                        name="userName"
                        value={profile.userName || ""}  // null 값을 방지하기 위해 빈 문자열로 대체
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="password"
                        label="비밀번호"
                        name="password"
                        value={profile.password || ""}  // null 값을 방지하기 위해 빈 문자열로 대체
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        type="password"
                        label="비밀번호 재확인"
                        name="confirmPassword"
                        value={profile.confirmPassword || ""}  // null 값을 방지하기 위해 빈 문자열로 대체
                        onChange={handleChange}
                        error={!!error && error === '비밀번호가 일치하지 않습니다.'}
                        helperText={error === '비밀번호가 일치하지 않습니다.' ? error : ''}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="이메일"
                        name="email"
                        type="email"
                        value={profile.email || ""}  // null 값을 방지하기 위해 빈 문자열로 대체
                        onChange={handleChange}
                        error={!!error && error === '올바른 이메일 형식이 아닙니다.'}
                        helperText={error === '올바른 이메일 형식이 아닙니다.' ? error : ''}
                    />
                    <MuiTelInput
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={profile.phone || ""}  // null 값을 방지하기 위해 빈 문자열로 대체
                        onChange={handlePhoneChange}
                        label="전화번호"
                        defaultCountry="KR"
                    />
                    <FormControl>
                        <RadioGroup
                            row
                            sx={{ mt: 0, mb: 0, gap: '16px' }}
                            defaultValue="privite"
                        >
                            <FormControlLabel value="public" control={<Radio />} label="공개" sx={{ m: 0, height: '32px' }} />
                            <FormControlLabel value="privite" control={<Radio />} label="비공개" sx={{ m: 0, height: '32px' }} />
                        </RadioGroup>
                    </FormControl>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        label="GitHub URL"
                        name="gitUrl"
                        value={profile.gitUrl || ""}  // null 값을 방지하기 위해 빈 문자열로 대체
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        rows={2}
                        label="자기소개"
                        name="bio"
                        value={profile.bio || ""}  // null 값을 방지하기 위해 빈 문자열로 대체
                        onChange={handleChange}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ProfileForm;

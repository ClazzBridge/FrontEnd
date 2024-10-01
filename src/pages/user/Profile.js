import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // named export로 임포트
import { MuiTelInput } from 'mui-tel-input';
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
  Grid,
} from "@mui/material";

// 아바타 이미지 파일들을 가져옵니다.
import avatar1 from '../../assets/images/image1.jpeg';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    name: '',
    memberId: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    gitUrl: '',
    bio: '',
    profileImageId: 1, // 기본 아바타 이미지 ID
    privacy: 'private', // 공개/비공개 기본값 설정
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("=================> 프로필 확인", token)
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // jwtDecode 사용
        const userId = decodedToken.id; // userId 추출

        console.log("토큰 디코더", decodedToken)
        console.log("id 추출", userId)
        axios.get(`http://localhost:8080/userlist/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            setProfile(response.data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching profile', error);
            setLoading(false);
          });
      } catch (error) {
        console.error('Invalid token', error); // 잘못된 토큰 처리
      }
    }
  }, []);


  const avatarImages = {
    1: avatar1
  };

  const selectedAvatar = avatarImages[profile.profileImageId] || avatar1;

  if (loading) {
    return <Typography>Loading...</Typography>;
  }



  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // 전화번호 값을 업데이트
    setProfile(prevState => ({ ...prevState, phone: newValue }));
  };

  const handlePrivacyChange = (e) => {
    setProfile(prevState => ({ ...prevState, privacy: e.target.value }));
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

    axios.post('http://localhost:8080/userlist/update', profile)
      .then(response => {
        alert('변경되었습니다.');
      })
      .catch(error => {
        console.error('변경에 실패하였습니다.', error);
      });
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: '' }}>
        {/* 좌측 프로필 이미지 */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            // src={selectedAvatar}
            src="https://mblogthumb-phinf.pstatic.net/MjAyMzA5MDlfMTIx/MDAxNjk0MjI5NzM2Njc2.LzOebx7NB3lKGhRrTwRdExfbmsSToAArZn7GCXKtivsg.ehUkqrK_yYjmi4Jb3E0_Hiau3LDRcJ5wKION1A4yxhYg.PNG.chois909/bj_%EC%9C%A0%ED%98%9C%EB%94%94_%EB%AF%B8%EC%8A%A4%ED%8B%B1_%EC%A7%84%EC%84%B1%EC%A4%80_%EC%9E%84%EC%8B%A0_%EB%82%99%ED%83%9C_%EC%86%8C%EB%83%A5%EC%9D%B4_%EC%A0%84%EC%99%80%EC%9D%B4%ED%94%84_%EC%9C%A0%EC%B9%B4_%EC%9D%B4%ED%98%BC_%EC%9E%85%EC%9E%A5%EB%AC%B8_%EB%B8%94%EB%A1%9C%EA%B7%B810.png?type=w800"
            alt="Profile Avatar"
            style={{ width: 150, height: 150, borderRadius: '50%' }}
          />
        </Box>

        {/* 우측 폼 */}
        <Box sx={{ flex: 3, ml: 4 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            프로필 수정
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* 그리드를 사용하여 2열로 배치 */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="이름"
                  name="name"
                  value={profile.name}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="아이디"
                  name="memberId"
                  value={profile.memberId || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="password"
                  label="비밀번호"
                  name="password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="password"
                  label="비밀번호 재확인"
                  name="confirmPassword"
                  value={profile.confirmPassword || ""}
                  onChange={handleChange}
                  error={!!error && error === '비밀번호가 일치하지 않습니다.'}
                  helperText={error === '비밀번호가 일치하지 않습니다.' ? error : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="이메일"
                  name="email"
                  type="email"
                  value={profile.email || ""}
                  onChange={handleChange}
                  error={!!error && error === '올바른 이메일 형식이 아닙니다.'}
                  helperText={error === '올바른 이메일 형식이 아닙니다.' ? error : ''}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="GitHub URL"
                  name="gitUrl"
                  value={profile.gitUrl || ""}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <MuiTelInput
                  value={profile.phone || ""}
                  onChange={handlePhoneChange}
                  label="전화번호"
                  defaultCountry="KR"
                  fullWidth
                />
              </Grid>

              {/* 공개/비공개 선택 라디오 버튼 */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <RadioGroup
                    row
                    value={profile.privacy}
                    defaultValue="private"
                    onChange={handlePrivacyChange}
                  >
                    <FormControlLabel value="public" control={<Radio />} label="공개" />
                    <FormControlLabel value="private" control={<Radio />} label="비공개" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>

            {/* 자기소개 텍스트박스 */}
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              label="자기소개"
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              sx={{ mt: 3 }}
            />

            {/* 에러 메시지 */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* 저장 버튼 */}
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
      </Box>
    </Container>
  );
};

export default ProfileForm;
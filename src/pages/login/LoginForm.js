import React, { useState } from "react";
import axios from "axios";
import {
    Button,
    TextField,
    Box,
    Typography,
    Avatar,
    Container,
    CssBaseline,
    Alert,
    CircularProgress,
} from "@mui/material";
import LaptopIcon from '@mui/icons-material/Laptop';

function LoginForm({ onLoginSuccess }) {
    const [memberId, setMemberId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const minLength = 8;

    const handleLogin = async (event) => {
        event.preventDefault();

        if (password.length < minLength) {
            setError(`비밀번호는 최소 ${minLength}자 이상이어야 합니다.`);
            return;
        }

        setLoading(true);

        try {
            console.log("1111=============>");
            const response = await axios.post("http://127.0.0.1:8080/api/user/sign", {
                memberId,
                password,
            });
            console.log("2222=============>");
            console.log(response);


            if (response.data) {
                localStorage.setItem("token", response.data.accessToken);
                console.log("response.data.refreshToken: " + response.data.refreshTokenCookie)
                document.cookie = `refreshToken=${response.data.refreshTokenCookie.value}; path=/;`;

                onLoginSuccess(memberId);
                setError("");
            } else {
                setError("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LaptopIcon />
                </Avatar>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        color: "black",
                        fontWeight: "bold",
                    }}
                >
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        id="userName"
                        label="ID"
                        name="userName"
                        autoComplete="userName"
                        autoFocus
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 1,
                        }}

                    />
                    <TextField
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 1,
                        }}

                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Box>
        </Container>
    );
}

export default LoginForm;

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"; // 달리는 아이콘

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default function Progress() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const [progressPercent, setProgressPercent] = React.useState(0);
    const steps = 6;

    // 시작 날짜와 목표 날짜 설정
    const startDate = new Date("2024-05-24");
    const targetDate = new Date("2024-12-03");

    const currentDate = new Date();
    const daysPassed = Math.floor(
        (currentDate - startDate) / (1000 * 60 * 60 * 24)
    );
    const daysRemaining = Math.ceil(
        (targetDate - currentDate) / (1000 * 60 * 60 * 24)
    );

    React.useEffect(() => {
        const updateProgress = () => {
            const currentDate = new Date();
            const timeDifference = targetDate - currentDate;
            const totalDuration = targetDate - startDate;
            const progress = Math.min(
                (1 - timeDifference / totalDuration) * steps,
                steps
            );
            setActiveStep(Math.floor(progress));
            setProgressPercent(
                parseFloat(Math.min((1 - timeDifference / totalDuration) * 100, 100).toFixed(2))
            );
        };

        updateProgress(); // 컴포넌트가 마운트될 때 진행 상태를 계산
        const interval = setInterval(updateProgress, 1000); // 1초마다 업데이트

        return () => clearInterval(interval);
    }, [targetDate, steps, startDate]);

    return (
        <Box
            sx={{
                maxWidth: 400,
                flexGrow: 1,
                position: "relative",
            }}
        >
            <Tooltip
                title={`지난 일수: ${daysPassed}일, 남은 일수: ${daysRemaining}일`}
                arrow
            >
                <Box
                    sx={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <MobileStepper
                        variant="progress"
                        steps={steps}
                        position="static"
                        activeStep={activeStep}
                        LinearProgressProps={{
                            sx: {
                                width: "100%",
                                flexGrow: 1,
                                backgroundColor: "whitesmoke",
                                borderRadius: "10px",
                            },
                        }}
                        sx={{ width: "100%", flexGrow: 1 }}
                    />
                    <LinearProgressWithLabel value={progressPercent} />
                    <DirectionsRunIcon
                        sx={{
                            position: "absolute",
                            left: `${progressPercent - 2.0}%`,
                            transform: "translateX(-50%)",
                            color: theme.palette.primary.main,
                            transition: "left 0.5s ease-out",
                        }}
                    />
                </Box>
            </Tooltip>
        </Box>
    );
}
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Progress() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [progressPercent, setProgressPercent] = React.useState(0);
  const steps = 6;

  // 시작 날짜와 목표 날짜 설정
  const startDate = new Date("2024-05-24");
  const targetDate = new Date("2024-12-03");

  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const timeDifference = targetDate - currentDate;
      const totalDuration = targetDate - startDate;
      const progress = Math.min(
        (1 - timeDifference / totalDuration) * steps,
        steps
      );
      setActiveStep(Math.floor(progress));
      setProgressPercent(
        Math.min((1 - timeDifference / totalDuration) * 100, 100).toFixed(2)
      );
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, [targetDate, steps, startDate]);

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1, position: "relative" }}>
      {/* <Typography variant="caption" display="block" gutterBottom>
        시작 날짜: {startDate.toLocaleDateString()}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        목표 날짜: {targetDate.toLocaleDateString()}
      </Typography> */}
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <MobileStepper
          variant="progress"
          steps={steps}
          position="static"
          activeStep={activeStep}
          sx={{ width: "100%", flexGrow: 1 }}
        />
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          {progressPercent}%
        </Typography>
      </Box>
    </Box>
  );
}

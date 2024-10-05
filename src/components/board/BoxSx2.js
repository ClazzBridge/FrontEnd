import * as React from "react";
import { Box, ThemeProvider } from "@mui/system";

export default function BoxSx() {
  return (
    <ThemeProvider
      theme={{
        palette: {
          primary: {
            main: "#f4f4f4",
            dark: "#f4f4f4",
          },
        },
      }}
    >
      <Box
        sx={{
          width: 150,
          height: 160,
          borderRadius: 1,
          bgcolor: "primary.main",
          "&:hover": {
            bgcolor: "primary.dark",
          },
        }}
      />
    </ThemeProvider>
  );
}

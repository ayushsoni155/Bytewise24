import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function Error404Page() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: isDark ? "#121212" : "#f9f9f9",
        color: isDark ? "#eee" : "#222",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        textAlign: "center",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          fontSize: { xs: 120, sm: 160 },
          fontWeight: "900",
          color: isDark ? theme.palette.error.main : theme.palette.error.dark,
          animation: "pulse 2s infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          "& svg": { fontSize: { xs: 90, sm: 130 }, mr: 1 },
        }}
        aria-label="Error 404"
      >
        <ErrorOutlineIcon />
        404
      </Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={1}
        sx={{ letterSpacing: 1.2 }}
      >
        Oops! Page Not Found
      </Typography>

      <Typography
        variant="body1"
        maxWidth={420}
        mb={4}
        sx={{ opacity: 0.7, fontSize: { xs: 16, sm: 18 } }}
      >
        The page you are looking for doesn’t exist or has been moved.
        Please check the URL or return to the homepage.
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        size="large"
        sx={{
          px: 5,
          py: 1.5,
          fontWeight: "600",
          borderRadius: 3,
          boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          },
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }}
      >
        Go Back Home
      </Button>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}

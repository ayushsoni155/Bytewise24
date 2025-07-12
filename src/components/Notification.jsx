// src/components/Notification.jsx
import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function Notification({ open, message, type = 'success', onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={type}
        // variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

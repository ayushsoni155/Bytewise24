import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Slide,
  Backdrop,
  Box,
} from '@mui/material';
import { WarningAmberRounded, InfoOutlined, CheckCircleOutline } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

/**
 * CustomConfirmDialog Component
 *
 * Props:
 * - open: boolean (controls visibility)
 * - onClose: function (called when dialog is closed)
 * - onConfirm: function (called when Yes is clicked)
 * - title: string (main title)
 * - message: string (supporting text)
 * - icon: 'warning' | 'info' | 'success' (controls displayed icon)
 * - yesLabel: string (default: "Yes")
 * - noLabel: string (default: "No")
 */

export default function CustomConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  icon = 'warning',
  yesLabel = 'Yes',
  noLabel = 'No',
}) {
  const theme = useTheme();

  const getIcon = () => {
    const iconProps = { fontSize: 'large', sx: { fontSize: 48, mb: 1 } };
    switch (icon) {
      case 'info':
        return <InfoOutlined color="info" {...iconProps} />;
      case 'success':
        return <CheckCircleOutline color="success" {...iconProps} />;
      default:
        return <WarningAmberRounded color="warning" {...iconProps} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="xs"
      fullWidth
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          px: 3,
          py: 2,
          textAlign: 'center',
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <Box mt={2}>{getIcon()}</Box>
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', mt: 1, mb: 1 }}>
        <Button variant="outlined" onClick={onClose} color="inherit">
          {noLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color={icon === 'success' ? 'success' : icon === 'info' ? 'info' : 'warning'}
        >
          {yesLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 

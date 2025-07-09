import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  Stack,
  Paper,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LockResetIcon from '@mui/icons-material/LockReset';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import axios from '../services/axios';

export default function ProfilePopup({ onClose }) {
  const { user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [updatePassword, setUpdatePassword] = useState('');

  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const mobileRegex = /^[6-9]\d{9}$/;

  // Auto-dismiss alert after 2 seconds
  useState(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: '', message: '' }), 2000);
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordSubmit = async () => {
    if (newPassword.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const res = await axios.put('/user/change-password', {
        security_answer: securityAnswer.trim(),
        new_password: newPassword.trim(),
      });

      setAlert({ type: 'success', message: res.data?.message || 'Password changed successfully!' });
      setSecurityAnswer('');
      setNewPassword('');
      setShowChangePassword(false);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err?.response?.data?.message || 'Password change failed. Try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();

    if (!trimmedName || !mobileRegex.test(trimmedMobile)) {
      setAlert({ type: 'error', message: 'Invalid name or mobile number' });
      return;
    }

    if (updatePassword && updatePassword.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const payload = {
        name: trimmedName,
        mobile: trimmedMobile,
      };
      if (updatePassword) payload.password = updatePassword;

      const res = await axios.put('/user/update-user', payload);

      setAlert({
        type: 'success',
        message: res.data?.message || 'Profile updated successfully!',
      });

      setShowUpdateProfile(false);
      setUpdatePassword('');
      fetchUser();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err?.response?.data?.error || 'Profile update failed',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Paper
      elevation={5}
      sx={{
        position: 'absolute',
        top: 20,
        right: 0,
        width: 300,
        borderRadius: 3,
        p: 2,
        zIndex: 1300,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Profile
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {!showUpdateProfile && !showChangePassword && (
        <>
          <Typography variant="body2"><strong>Enrollment:</strong> {user.enrollment}</Typography>
          <Typography variant="body2"><strong>Name:</strong> {user.name}</Typography>
          <Typography variant="body2"><strong>Mobile:</strong> {user.mobile}</Typography>
          <Typography variant="body2">
            <strong>Status:</strong>{' '}
            <span style={{ color: user.user_status === 'active' ? 'green' : 'red' }}>
              {user.user_status}
            </span>
          </Typography>
          <Typography variant="body2" mb={1}>
            <strong>Security Q:</strong> {user.security_question}
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Stack spacing={1}>
            <Button
              fullWidth variant="outlined" size="small"
              startIcon={<LockResetIcon />}
              onClick={() => { setShowChangePassword(true); setShowUpdateProfile(false); }}
            >
              Change Password
            </Button>

            <Button
              fullWidth variant="outlined" size="small"
              startIcon={<AccountCircleIcon />}
              onClick={() => { setShowUpdateProfile(true); setShowChangePassword(false); }}
            >
              Update Profile
            </Button>

            <Button
              fullWidth variant="outlined" size="small"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate('/orders')}
            >
              Orders
            </Button>

            <Button
              fullWidth variant="contained" color="error" size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </>
      )}

      {showChangePassword && (
        <Box>
          <Typography variant="body2" mb={1}>
            <strong>Security Q:</strong> {user.security_question}
          </Typography>
          <TextField
            fullWidth size="small" label="Security Answer"
            value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)}
            sx={{ my: 1 }}
          />
          <TextField
            fullWidth size="small" label="New Password" type="password"
            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 1 }}
            error={newPassword.length > 0 && newPassword.length < 6}
            helperText={newPassword.length > 0 && newPassword.length < 6 ? 'Min 6 characters' : ''}
          />
          <Button
            fullWidth variant="contained" size="small"
            onClick={handlePasswordSubmit} disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Submit'}
          </Button>
        </Box>
      )}

      {showUpdateProfile && (
        <Box>
          <TextField
            fullWidth size="small" label="Name"
            value={name} onChange={(e) => setName(e.target.value)}
            sx={{ my: 1 }}
            error={!name.trim()}
            helperText={!name.trim() ? 'Name is required' : ''}
          />
          <TextField
            fullWidth size="small" label="Mobile"
            value={mobile} onChange={(e) => setMobile(e.target.value)}
            sx={{ mb: 1 }}
            error={mobile.length > 0 && !mobileRegex.test(mobile)}
            helperText={mobile.length > 0 && !mobileRegex.test(mobile) ? 'Invalid mobile number' : ''}
          />
          <Button
            fullWidth variant="contained" size="small"
            onClick={handleProfileUpdate} disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </Box>
      )}

      {alert.message && (
        <Alert severity={alert.type} sx={{ mt: 2 }}>
          {alert.message}
        </Alert>
      )}
    </Paper>
  );
}

import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  Stack,
  Paper,
  TextField,
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
import Notification from './Notification';
import CustomConfirmDialog from './CustomConfirmDialog';

export default function ProfilePopup({ onClose }) {
  const { user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');

  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [notify, setNotify] = useState({ open: false, message: '', severity: 'success' });

  const mobileRegex = /^[6-9]\d{9}$/;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordSubmit = async () => {
    if (!securityAnswer.trim() || newPassword.trim().length < 6) return;

    setLoading(true);
    try {
      await axios.put('/user/change-password', {
        enrollment: user.enrollment,
        security_answer: securityAnswer.trim(),
        new_password: newPassword.trim(),
      });
      setSecurityAnswer('');
      setNewPassword('');
      setShowChangePassword(false);
      fetchUser();
      setNotify({ open: true, message: 'Password changed successfully!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotify({ open: true, message: 'Password update failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!name.trim() || !mobileRegex.test(mobile.trim())) {
      setNotify({ open: true, message: 'Invalid name or mobile number.', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        mobile: mobile.trim(),
      };
      await axios.put('/user/update-user', payload);
      setShowUpdateProfile(false);
      fetchUser();
      setNotify({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setNotify({ open: true, message: 'Profile update failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
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
              error={!securityAnswer.trim()}
              helperText={!securityAnswer.trim() ? 'Required' : ''}
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
              onClick={() => {
                setConfirmAction(() => handlePasswordSubmit);
                setConfirmOpen(true);
              }}
              disabled={loading || !securityAnswer.trim() || newPassword.length < 6}
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
              helperText={!name.trim() ? 'Required' : ''}
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
              onClick={() => {
                setConfirmAction(() => handleProfileUpdate);
                setConfirmOpen(true);
              }}
              disabled={loading || !name.trim() || !mobileRegex.test(mobile.trim())}
            >
              {loading ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </Box>
        )}

        <CustomConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            if (confirmAction) confirmAction();
            setConfirmOpen(false);
          }}
          message="Are you sure you want to proceed with this action?"
        />
      </Paper>
       <Notification
              open={notify.open}
              message={notify.message}
              type={notify.type}
              onClose={() => setNotify({ ...notify, open: false })}
            />
    </>
  );
}

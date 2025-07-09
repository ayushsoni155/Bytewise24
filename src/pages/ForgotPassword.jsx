import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from '../services/axios'; // Your custom Axios instance
import { useNavigate } from 'react-router-dom';

const enrollmentRegex = /^(0704|0714)(CS|IT|AD)(20|21|22|23|24|25|26)(1[0-2][0-9]{2}|1300)$/;

export default function ForgotPassword() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!enrollmentRegex.test(enrollment)) {
      setError('Invalid enrollment number format');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('/user/verify-enrollment', { enrollment });
      setSecurityQuestion(res.data.security_question);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!securityAnswer.trim()) {
      setError('Please provide an answer');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await axios.put('/user/change-password', {
        enrollment,
        security_answer: securityAnswer,
        new_password: newPassword,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor:
          theme.palette.mode === 'light'
            ? 'linear-gradient(to right, #e3f2fd, #fce4ec)'
            : 'linear-gradient(to right, #1e1e1e, #2a2a2a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 4,
          backgroundColor:
            theme.palette.mode === 'light'
              ? 'rgba(255, 255, 255, 0.75)'
              : 'rgba(30, 30, 30, 0.75)',
          backdropFilter: 'blur(12px)',
          boxShadow:
            theme.palette.mode === 'light'
              ? '0 8px 32px rgba(0,0,0,0.1)'
              : '0 8px 32px rgba(255,255,255,0.05)',
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight={600}
          color="primary"
          gutterBottom
        >
          Reset Password
        </Typography>

        <Typography
          variant="subtitle2"
          align="center"
          color="text.secondary"
          mb={2}
        >
          Verify your identity to reset password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 1 ? (
          <Box component="form" onSubmit={handleEnrollmentSubmit}>
            <TextField
              label="Enrollment Number"
              name="enrollment"
              value={enrollment}
              onChange={(e) => setEnrollment(e.target.value)}
              fullWidth
              required
              placeholder="e.g. 0704CS230100"
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleResetSubmit}>
            <TextField
              label="Security Question"
              value={securityQuestion}
              fullWidth
              
              margin="normal"
            />

            <TextField
              label="Your Answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              fullWidth
              required
              margin="normal"
            />

            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              inputProps={{ minLength: 6 }}
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              inputProps={{ minLength: 6 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, borderRadius: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

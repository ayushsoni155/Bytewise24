import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Link,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const enrollmentRegex = /^(0704|0714)(CS|IT|AD)(20|21|22|23|24|25|26)(1[0-2][0-9]{2}|1300)$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({ enrollment: '', password: '' });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!enrollmentRegex.test(form.enrollment)) {
      newErrors.enrollment = 'Invalid enrollment number format';
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await login(form);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
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
        transition: 'background 0.4s ease',
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
          color: theme.palette.text.primary,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight={600}
          color="primary"
          gutterBottom
        >
          Welcome Back
        </Typography>

        <Typography
          variant="subtitle2"
          align="center"
          color="text.secondary"
          mb={2}
        >
          Login to continue to your dashboard
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Enrollment Number"
            name="enrollment"
            value={form.enrollment}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.enrollment}
            helperText={errors.enrollment}
            placeholder="e.g. 0704CS230100"
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password}
            inputProps={{ minLength: 6 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, borderRadius: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>

          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="hover"
              variant="body2"
            >
              Forgot password?
            </Link>
            <Link
              component={RouterLink}
              to="/signup"
              underline="hover"
              variant="body2"
            >
              New user? Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

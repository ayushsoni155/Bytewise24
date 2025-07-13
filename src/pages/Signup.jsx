import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Paper,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AcceptPolicyPopup from '../components/AcceptPolicyPopup';

const enrollmentRegex = /^(0704|0714)(CS|IT|AD)(20|21|22|23|24|25|26)(1[0-2][0-9]{2}|1300)$/;
const mobileRegex = /^[6-9]\d{9}$/;

const security_question = [
  'Who is your best friend?',
  'What is your pet’s name?',
  'What is your favorite food?',
  'What city were you born in?',
];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({
    enrollment: '',
    fullName: '',
    mobile: '',
    security_question: '',
    security_answer: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptOpen, setAcceptOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((show) => !show);
  const toggleShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const validate = () => {
    const newErrors = {};
    if (!enrollmentRegex.test(form.enrollment)) {
      newErrors.enrollment = 'Invalid enrollment number format';
    }
    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!mobileRegex.test(form.mobile)) {
      newErrors.mobile = 'Invalid mobile number';
    }
    if (!form.security_question) {
      newErrors.security_question = 'Please select a security question';
    }
    if (!form.security_answer.trim()) {
      newErrors.security_answer = 'Please answer the security question';
    }
    if (!form.password || form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setErrorMsg('');
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await signup({
        enrollment: form.enrollment,
        name: form.fullName,
        mobile: form.mobile,
        security_question: form.security_question,
        security_answer: form.security_answer,
        password: form.password,
      });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Signup failed');
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
        mt: 8,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 480,
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
        }}
      >
        <Typography variant="h4" align="center" fontWeight={600} color="primary" gutterBottom>
          Create an Account
        </Typography>

        <Typography variant="subtitle2" align="center" color="text.secondary" mb={2}>
          Join and explore your personalized dashboard
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Form fields */}
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
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.fullName}
          helperText={errors.fullName}
        />

        <TextField
          label="Mobile Number"
          name="mobile"
          value={form.mobile}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.mobile}
          helperText={errors.mobile}
          placeholder="10-digit mobile number"
        />

        <TextField
          select
          label="Security Question"
          name="security_question"
          value={form.security_question}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.security_question}
          helperText={errors.security_question}
        >
          {security_question.map((q) => (
            <MenuItem key={q} value={q}>
              {q}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Security Answer"
          name="security_answer"
          value={form.security_answer}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.security_answer}
          helperText={errors.security_answer}
        />

        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.password}
          helperText={errors.password}
          inputProps={{ minLength: 6 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          inputProps={{ minLength: 6 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleShowConfirmPassword} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Sign Up Button opens AcceptPolicyPopup */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, borderRadius: 2 }}
          onClick={() => {
            if (validate()) setAcceptOpen(true);
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
        </Button>

        <Box mt={2} display="flex" justifyContent="center">
          <Typography variant="body2" color="text.secondary" mr={1}>
            Already have an account?
          </Typography>
          <Link component={RouterLink} to="/login" underline="hover" variant="body2">
            Login
          </Link>
        </Box>
      </Paper>

      {/* Accept Terms Popup */}
      <AcceptPolicyPopup
        open={acceptOpen}
        onClose={() => setAcceptOpen(false)}
        onAccept={handleSubmit}
      />
    </Box>
  );
}

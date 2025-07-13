import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Link,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function PrivacyPolicyModal({ open, onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: '60%' },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: isDark ? '#1e1e1e' : '#fff',
    color: isDark ? '#fff' : '#000',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Privacy Policy
          </Typography>
          <IconButton onClick={onClose} sx={{ color: isDark ? '#fff' : '#000' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ mb: 2, color: isDark ? 'gray' : 'text.secondary' }}>
          Last Updated: July 13, 2025
        </Typography>
        <Divider sx={{ mb: 3, bgcolor: isDark ? '#444' : '#ccc' }} />

        <Typography variant="h6" gutterBottom>1. Introduction</Typography>
        <Typography paragraph>
          At ByteWise, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
        </Typography>

        <Typography variant="h6" gutterBottom>2. Information We Collect</Typography>
        <ul>
          <li>Your name, enrollment ID, phone number, and payment details.</li>
          <li>Cookies and tracking data for a personalized experience.</li>
        </ul>

        <Typography variant="h6" gutterBottom>3. How We Use Your Information</Typography>
        <ul>
          <li>To process payments and deliver services.</li>
          <li>To notify you about orders, updates, or support.</li>
          <li>To enhance user experience through feedback.</li>
          <li>To comply with legal and financial obligations.</li>
        </ul>

        <Typography variant="h6" gutterBottom>4. Data Security</Typography>
        <Typography paragraph>
          We use encryption, secure servers, and access control to protect your data from unauthorized access or leaks.
        </Typography>

        <Typography variant="h6" gutterBottom>5. Third-Party Services</Typography>
        <Typography paragraph>
          We integrate with services like <strong>Razorpay</strong> for payments and analytics tools to enhance our platform. These partners may access necessary data only to perform their tasks.
        </Typography>

        <Typography variant="h6" gutterBottom>6. Your Rights</Typography>
        <Typography paragraph>
          You have the right to access, correct, or delete your data. To do so, contact us via the channels below.
        </Typography>

        <Typography variant="h6" gutterBottom>7. Cookies</Typography>
        <Typography paragraph>
          Cookies help us remember you and improve your experience. You can control cookies in your browser settings.
        </Typography>

        <Typography variant="h6" gutterBottom>8. Changes to This Policy</Typography>
        <Typography paragraph>
          We may update this Privacy Policy occasionally. Changes will be reflected here with an updated date.
        </Typography>

        <Typography variant="h6" gutterBottom>9. Contact Us</Typography>
        <Typography variant="body2" paragraph>
          For questions about privacy, please reach out to us:
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          Telegram: <Link href="https://t.me/Bytewise24" target="_blank" underline="hover" color="primary">@Bytewise24</Link>{'\n'}
          Gmail: <Link href="mailto:bytewise24.pvt@gmail.com" underline="hover" color="primary">bytewise24.pvt@gmail.com</Link>{'\n'}
          Instagram: <Link href="https://www.instagram.com/bytewise24.pvt/profilecard/?igsh=MTN0eHYybW54ZThsaQ==" target="_blank" underline="hover" color="primary">bytewise24.pvt</Link>
        </Typography>
      </Box>
    </Modal>
  );
}

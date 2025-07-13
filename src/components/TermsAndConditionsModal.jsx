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

export default function TermsAndConditionsModal({ open, onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const style = {
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
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Terms & Conditions
          </Typography>
          <IconButton onClick={onClose} sx={{ color: isDark ? '#fff' : '#000' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ mb: 1, color: isDark ? 'gray' : 'text.secondary' }}>
          Last Updated: July 13, 2025
        </Typography>
        <Divider sx={{ mb: 3, bgcolor: isDark ? '#444' : '#ccc' }} />

        <Typography variant="h6" gutterBottom>1. Introduction</Typography>
        <Typography paragraph>
          Welcome to ByteWise. By using our platform, including access to notes, lab manuals, videos, and certified courses,
          you agree to the following terms and conditions.
        </Typography>

        <Typography variant="h6" gutterBottom>2. Lab Manual Purchases</Typography>
        <Typography paragraph>All lab manual purchases follow these conditions:</Typography>
        <ul>
          <li>Cancellations and refunds are allowed only while your order status is <strong>pending</strong>.</li>
          <li>Once the order is marked <strong>successfull</strong>, cancellations or refunds are <strong>not permitted</strong>.</li>
          <li>
            If you face any issues, please contact us via Telegram at{' '}
            <Link href="https://t.me/Bytewise24" target="_blank" underline="hover" color="primary">
              <strong>@Bytewise24</strong>
            </Link>.
          </li>
        </ul>

        <Typography variant="h6" gutterBottom>3. Delivery of Lab Manuals</Typography>
        <ul>
          <li>Delivery will align with your college schedule.</li>
          <li>No exact delivery date/time is promised.</li>
          <li>You will be notified when your order is ready.</li>
        </ul>

        <Typography variant="h6" gutterBottom>4. Contacting Developers</Typography>
        <Typography paragraph>
          For order issues or clarifications, reach out on Telegram at{' '}
          <Link href="https://t.me/Bytewise24" target="_blank" underline="hover" color="primary">
            <strong>@Bytewise24</strong>
          </Link>.
        </Typography>

        <Typography variant="h6" gutterBottom>5. Operational Address</Typography>
        <Box mb={2}>
          <Typography><strong>ByteWise</strong></Typography>
          <Typography fontSize="0.9rem" sx={{ whiteSpace: 'pre-line', color: isDark ? 'gray' : 'text.secondary' }}>
            MIT Campus, Behind Air Strip, Dewas Rd, Ujjain,
            Madhya Pradesh 456001, India.
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>6. Agreement</Typography>
        <Typography paragraph>
          By purchasing or using ByteWise services, you confirm that you agree with these terms. If you disagree, please do not continue using our services.
        </Typography>
      </Box>
    </Modal>
  );
}

import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Link,
  IconButton,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsAndConditionsModal from './TermsAndConditionsModal';

export default function AcceptPolicyPopup({ open, onClose, onAccept }) {
  const [checked, setChecked] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '400px' },
    bgcolor: isDark ? '#1e1e1e' : '#fff',
    color: isDark ? '#fff' : '#000',
    borderRadius: 3,
    boxShadow: 24,
    p: 3,
  };

  const handleAccept = () => {
    if (checked) {
      onAccept();
      onClose();
      setChecked(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Accept Terms & Privacy
            </Typography>
            <IconButton onClick={onClose} sx={{ color: isDark ? '#fff' : '#000' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I accept the{' '}
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTerms(true);
                  }}
                  underline="hover"
                >
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenPrivacy(true);
                  }}
                  underline="hover"
                >
                  Privacy Policy
                </Link>
              </Typography>
            }
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!checked}
            onClick={handleAccept}
            sx={{ mt: 2 }}
          >
            Continue
          </Button>
        </Box>
      </Modal>

      <TermsAndConditionsModal open={openTerms} onClose={() => setOpenTerms(false)} />
      <PrivacyPolicyModal open={openPrivacy} onClose={() => setOpenPrivacy(false)} />
    </>
  );
}

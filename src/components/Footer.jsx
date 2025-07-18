import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  useTheme,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import { Link } from 'react-router-dom';

import TermsAndConditionsModal from './TermsAndConditionsModal'; // Import your modal component
import PrivacyPolicyModal from './PrivacyPolicyModal';           // Import your modal component

export default function Footer() {
  const theme = useTheme();

  // State to control modals
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#121212',
        color: '#ffffff',
        mt: 'auto',
        width: '100%',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          px: { xs: 2, sm: 4 },
          py: 4,
          borderRadius: 0,
          backgroundColor: '#121212',
          color: '#ffffff',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* About */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#ffffff' }}>
                <SchoolIcon
                  fontSize="small"
                  sx={{ mr: 1, color: theme.palette.primary.main }}
                />
                ByteWise
              </Typography>
              <Typography variant="body2" sx={{ color: '#cccccc' }}>
                One-stop platform for engineering students. Get notes, lab manuals, curated videos, and certified tech courses — all in one place.
              </Typography>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={6} md={4}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#ffffff' }}>
                Quick Links
              </Typography>
              <Box>
                <Link to="/notes" style={linkStyle}>Notes</Link>
                <Link to="/lab-manuals" style={linkStyle}>Lab Manuals</Link>
                <Link to="/videos" style={linkStyle}>Video Lectures</Link>
                <Link to="/courses" style={linkStyle}>Free Courses</Link>
                {/* Add Terms & Privacy triggers here */}
                <Typography
                  component="span"
                  onClick={() => setOpenTerms(true)}
                  sx={{ ...tpStyle }}
                >
                  Terms & Conditions
                </Typography>
                <Typography
                  component="span"
                  onClick={() => setOpenPrivacy(true)}
                  sx={{ ...tpStyle }}
                >
                  Privacy Policy
                </Typography>
              </Box>
            </Grid>

            {/* Social Links */}
            <Grid item xs={6} md={4}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#ffffff' }}>
                Connect With Us
              </Typography>
              <Box>
                <IconButton href="https://github.com/ayushsoni155" target="_blank" sx={{ color: '#ffffff' }}>
                  <GitHubIcon />
                </IconButton>
                <IconButton href="https://ayushsoni.vercel.app" target="_blank" sx={{ color: '#ffffff' }}>
                  <LanguageIcon />
                </IconButton>
                <IconButton href="https://instagram.com/ayushsoni.155" target="_blank" sx={{ color: '#ffffff' }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton href="mailto:ayushsoni.gcsb@gmail.com" sx={{ color: '#ffffff' }}>
                  <EmailIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, backgroundColor: '#444' }} />

          <Typography variant="body2" align="center" sx={{ color: '#bbbbbb' }}>
            © {new Date().getFullYear()} ByteWise | Developed by Ayush Soni | v2.0.0
          </Typography>
        </Container>
      </Paper>
      <TermsAndConditionsModal open={openTerms} onClose={() => setOpenTerms(false)} />
      <PrivacyPolicyModal  open={openPrivacy} onClose={() => setOpenPrivacy(false)} />
    </Box>
  );
}

// Updated link style for dark footer
const linkStyle = {
  display: 'block',
  marginBottom: 8,
  textDecoration: 'none',
  color: '#cccccc',
  fontSize: '1rem',
};

const tpStyle={
  display: 'block',
  marginBottom: 1,
  textDecoration: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
   color: '#90caf9'
}
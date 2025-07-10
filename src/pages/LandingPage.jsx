import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Notes',
    description: 'Access semester-wise notes for all subjects, curated from RGPV toppers.',
    image: '/notes-img.png',
    link: '/notes',
  },
  {
    title: 'Lab Manuals',
    description: 'Buy practical-ready lab manuals designed to help you score in labs.',
    image: '/lab-img.png',
    link: '/lab-manuals',
  },
  {
    title: 'Video Lectures',
    description: 'Watch top YouTube playlists covering syllabus topics effectively.',
    image: '/videos-img.png',
    link: '/videos',
  },
  {
    title: 'Free Courses',
    description: 'Get certified with Microsoft, GitHub, and AI fundamentals — free of cost.',
    image: '/courses-img.png',
    link: '/courses',
  },
];

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mt: { xs: 8, md: 10 } }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(to right, #111827, #1f2937)'
            : 'linear-gradient(to right, #e3f2fd, #bbdefb)',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight={700} gutterBottom>
            Empower Your Engineering Journey 🎓
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            ByteWise provides semester notes, lab manuals, curated videos, and certified courses — everything you need, in one place.
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/notes"
            sx={{ mt: 2, borderRadius: 8, px: 4 }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* About Us Section */}
      <Container sx={{ py: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backgroundColor:
              theme.palette.mode === 'dark' ? 'grey.900' : 'background.default',
          }}
        >
          <Typography variant="h4" fontWeight={600} gutterBottom textAlign="center">
            About ByteWise
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            ByteWise is a platform created by students, for students. We aim to simplify the academic life of engineering students by offering high-quality, syllabus-oriented study resources — including notes, lab manuals, video lectures, and free certification courses. Our goal is to save your time and boost your grades with the right material at the right time.
          </Typography>
        </Paper>
      </Container>

      {/* Features Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} textAlign="center" gutterBottom>
          What You'll Find
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={feature.image}
                  alt={feature.title}
                  sx={{ objectFit: 'contain' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {feature.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    component={Link}
                    to={feature.link}
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: 3 }}
                  >
                    Explore
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

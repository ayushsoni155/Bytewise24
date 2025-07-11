import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Alert,
  Button,
  Paper,
  Chip,
  Tooltip,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

export default function Courses() {
  const { isLoggedIn } = useAuth();
  const [courses, setCourses] = useState([]);
  const [notify, setNotify] = useState({
    open: false,
    message: '',
    type: 'info',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('/courses/fetch-courses');
        setCourses(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (<Container
             maxWidth={false}
             disableGutters
             sx={{
               mt: { xs: 9, sm: 10, md: 12 },
               mb: { xs: 4, sm: 6 },
               px: { xs: 1, sm: 2, md: 4, lg: 4 },
             }}
           >
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 4,
          boxShadow: (theme) => theme.shadows[5],
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={600} align="center">
          Free Certification Courses
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} justifyContent="center">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} display="flex" justifyContent="center">
                <Card
                  sx={{
                    width: { xs: 260, sm: 260, md: 280 },
                    height: { xs: 'auto', md: 360 },
                    borderRadius: 3,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                  }}
                >
                    <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Skeleton width="80%" height={28} sx={{ mb: 1 }} />
                      <Skeleton width="100%" height={20} sx={{ mb: 1 }} />
                      <Skeleton width="60%" height={32} />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : courses.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center">
                    No courses available.
                  </Typography>
                </Grid>
              ) : (
                courses.map((course) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={course.course_id}
                    display="flex"
                    justifyContent="center"
                  >
                    <Tooltip title={course.description} arrow placement="top">
                      <Card
                        sx={{
                          width: 280,
                          height: 360,
                          borderRadius: 3,
                          boxShadow: 3,
                          transition: '0.3s',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            transform: 'scale(1.03)',
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={course.image}
                          alt={course.title}
                          sx={{ objectFit: 'contain', p: 1 }}
                        />
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography variant="h6" fontWeight={600} noWrap>
                            {course.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              flexGrow: 1,
                              mt: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: 13,
                            }}
                          >
                            {course.description}
                          </Typography>

                          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            <Chip label={course.organization} size="small" color="primary" />
                            <Chip label={course.difficulty} size="small" color="secondary" />
                            <Chip label={course.duration} size="small" variant="outlined" />
                          </Box>

                          <Button
                            variant="outlined"
                            size="small"
                            endIcon={<LaunchIcon />}
                            sx={{ mt: 2, alignSelf: 'flex-start' }}
                            {...(isLoggedIn
                              ? {
                                  href: course.link,
                                  target: '_blank',
                                  rel: 'noopener noreferrer',
                                }
                              : {
                                  onClick: () =>
                                    setNotify({
                                      open: true,
                                      message: 'Please login to view this course.',
                                      type: 'info',
                                    }),
                                })}
                          >
                            View Course
                          </Button>
                        </CardContent>
                      </Card>
                    </Tooltip>
                  </Grid>
                ))
              )}
        </Grid>
      </Paper>

      <Notification
        open={notify.open}
        message={notify.message}
        type={notify.type}
        onClose={() => setNotify({ ...notify, open: false })}
      />
    </Container>
  );
}

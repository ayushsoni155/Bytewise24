/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import {
  Box,
  Tooltip,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Button,
  Paper,
  Skeleton,
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import FilterBar from "../components/FilterBar";

export default function Notes() {
  const { isLoggedIn } = useAuth();

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState({ open: false, message: '', type: 'info' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/notes/fetch-notes');
        const visibleNotes = res.data.filter(item => item.visibility_status === "visible");
        setAllItems(visibleNotes);
        setFilteredItems(visibleNotes);
      } catch (err) {
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleFilter = ({ search, sem }) => {
    const filtered = allItems.filter((item) => {
      const name = item.subjects?.name?.toLowerCase() || "";
      const code = item.subject_code?.toLowerCase() || "";
      const matchesSearch = name.includes(search) || code.includes(search);
      const matchesSem = sem ? item.subjects?.sem === parseInt(sem) : true;
      return matchesSearch && matchesSem;
    });
    setFilteredItems(filtered);
  };

  return (
    <Container
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
          Notes
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FilterBar onFilter={handleFilter} />

        <Grid container spacing={3} justifyContent="center">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Grid item xs={6} sm={6} md={3} key={index} display="flex" justifyContent="center">
                <Card
                  sx={{
                    width: { xs: '100%', sm: 260, md: 280 },
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
          ) : filteredItems.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                No notes available.
              </Typography>
            </Grid>
          ) : (
            filteredItems.map((note) => (
              <Grid item xs={6} sm={6} md={3} key={note.notes_id || note.id} display="flex" justifyContent="center">
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {note.subjects.name}
                      </Typography>
                      <Typography variant="caption">Subject Code: {note.subject_code}</Typography><br />
                      <Typography variant="caption">Semester: {note.subjects.sem}</Typography><br />
                      <Typography variant="caption">Branch: {note.subjects.branch}</Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <Card
                    sx={{
                      width: { xs: '100%', sm: 260, md: 280 },
                      height: { xs: 'auto', md: 360 },
                      borderRadius: 3,
                      boxShadow: 3,
                      transition: '0.3s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={note.image}
                      alt={note.subjects.name}
                      sx={{ objectFit: 'cover' }}
                    />

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {note.subjects.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flexGrow: 1,
                          mt: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {note.subjects.description}
                      </Typography>

                      {isLoggedIn ? (
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<LaunchIcon />}
                          href={note.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ mt: 2, alignSelf: 'flex-start' }}
                        >
                          View PDF
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<LaunchIcon />}
                          onClick={() =>
                            setNotify({
                              open: true,
                              message: 'Please login to view this PDF.',
                              type: 'info',
                            })
                          }
                          sx={{ mt: 2, alignSelf: 'flex-start' }}
                        >
                          View PDF
                        </Button>
                      )}
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

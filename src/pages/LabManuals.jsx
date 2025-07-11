/* eslint-disable no-unused-vars */
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
  Tooltip,
  Button,
  Paper,
  Skeleton,
  Alert,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import FilterBar from '../components/FilterBar';

export default function LabManuals() {
  const [manuals, setManuals] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState({ open: false, message: '', type: 'info' });
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchManuals = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/lab-manuals/fetch-labManuals');
        const visibleManuals = res.data.filter((m) => m.visibility_status === 'visible');
        setManuals(visibleManuals);
        setAllItems(visibleManuals);
        setFilteredItems(visibleManuals);
      } catch (err) {
        setError('Failed to load lab manuals');
      } finally {
        setLoading(false);
      }
    };
    fetchManuals();
  }, []);

  const handleFilter = ({ search, sem }) => {
    const filtered = allItems.filter((item) => {
      const name = item.subjects?.name?.toLowerCase() || '';
      const code = item.subject_code?.toLowerCase() || '';
      const matchesSearch = name.includes(search.toLowerCase()) || code.includes(search.toLowerCase());
      const matchesSem = sem ? item.subjects?.sem === parseInt(sem) : true;
      return matchesSearch && matchesSem;
    });
    setFilteredItems(filtered);
  };

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item, 1);
    } catch (err) {
      setNotify({ open: true, message: 'Failed to add to cart', type: 'error' });
    }
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
          Lab Manuals
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
          ) : filteredItems.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                No lab manuals available.
              </Typography>
            </Grid>
          ) : (
            filteredItems.map((manual) => {
              const subject = manual.subjects || {};
              return (
                <Grid item xs={12} sm={6} md={3} key={manual.lab_manual_id} display="flex" justifyContent="center">
                  <Tooltip
                    title={
                      <>
                        <Typography fontSize={13}><b>Subject:</b> {subject.name || 'N/A'}</Typography>
                        <Typography fontSize={13}><b>Code:</b> {manual.subject_code}</Typography>
                        <Typography fontSize={13}><b>Semester:</b> {subject.sem || '-'}</Typography>
                        <Typography fontSize={13}><b>Branch:</b> {subject.branch || '-'}</Typography>
                      </>
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
                        image={manual.manual_image || '/placeholder.jpg'}
                        alt={subject.name || 'Manual'}
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
                          {subject.name || 'Manual'}
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
                          {manual.manual_description}
                        </Typography>

                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          Pages: {manual.no_of_pages}
                        </Typography>

                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ mt: 0, color: 'primary.main' }}
                        >
                          ₹{manual.selling_price}
                        </Typography>

                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddShoppingCartIcon />}
                          onClick={() => handleAddToCart(manual)}
                          sx={{ mt: 1, alignSelf: 'flex-start' }}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Tooltip>
                </Grid>
              );
            })
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

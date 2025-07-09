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

export default function LabManuals() {
  const [manuals, setManuals] = useState([]);
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
        setManuals(res.data.filter(m => m.visibility_status === 'visible'));
      } catch (err) {
        setError('Failed to load lab manuals');
      } finally {
        setLoading(false);
      }
    };

    fetchManuals();
  }, []);

  const handleAddToCart = async (id) => {
    try {
      await addToCart(id, 1);
      setNotify({ open: true, message: 'Added to cart', type: 'success' });
    } catch (err) {
      setNotify({ open: true, message: 'Failed to add to cart', type: 'error' });
    }
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ mt: 10, mb: 6, px: { xs: 2, sm: 4, md: 8 } }}>
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 4,
          boxShadow: theme => theme.shadows[5],
          backgroundColor: theme => theme.palette.background.paper,
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

        <Grid container spacing={3} justifyContent="center">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} display="flex" justifyContent="center">
                  <Card
                    sx={{
                      width: 280,
                      height: 360,
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
            : manuals.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center">
                    No lab manuals available.
                  </Typography>
                </Grid>
              ) : (
                manuals.map((manual) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={manual.lab_manual_id}
                    display="flex"
                    justifyContent="center"
                  >
                    <Tooltip
                      title={
                        <>
                          <Typography fontSize={13}>
                            <b>Subject:</b> {manual.subjects.name}
                          </Typography>
                          <Typography fontSize={13}>
                            <b>Subject Code:</b> {manual.subject_code}
                          </Typography>
                          <Typography fontSize={13}>
                            <b>Semester:</b> {manual.subjects.sem}
                          </Typography>
                          <Typography fontSize={13}>
                            <b>Branch:</b> {manual.subjects.branch}
                          </Typography>
                        </>
                      }
                      arrow
                      placement="top"
                    >
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
                          image={manual.manual_image}
                          alt={manual.subjects.name}
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
                            {manual.subjects.name}
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

                          {/* Number of pages */}
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
                            onClick={() => handleAddToCart(manual.lab_manual_id)}
                            sx={{ mt: 1, alignSelf: 'flex-start' }}
                          >
                            Add to Cart
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

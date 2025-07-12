import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Box,
  Paper,
  Skeleton,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import RazorpayButton from '../components/RazorpayButton';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    loading,
    incrementQuantity,
    decrementQuantity,
  } = useCart();

  const [total, setTotal] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsPageLoading(false), 400);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const totalPrice = cartItems.reduce((sum, item) => {
      const manual = item.lab_manuals || item;
      return sum + (manual?.selling_price || 0) * item.quantity;
    }, 0);
    setTotal(totalPrice);
  }, [cartItems]);

  const handleIncrement = (item) => {
    incrementQuantity(item);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      decrementQuantity(item);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item);
  };

  const renderSkeletonCard = (key) => (
    <Grid item xs={12} sm={6} md={3} key={key} display="flex" justifyContent="center">
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
          <Skeleton width="80%" height={24} sx={{ mb: 1 }} />
          <Skeleton width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton width="60%" height={20} />
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box
    sx={ {minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',}}
    >
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
          flexGrow: 1, // Ensures it expands to fill the height
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={600} align="center">
          Your Cart
        </Typography>

        {loading || isPageLoading ? (
          <Grid container spacing={3} justifyContent="center">
            {Array.from({ length: 4 }).map((_, index) => renderSkeletonCard(index))}
          </Grid>
        ) : cartItems.length === 0 ? (
          <Box flexGrow={1} display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h6" align="center">
              Your cart is empty.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center">
              {cartItems.map((item) => {
                const manual = item.lab_manuals || item;
                const key = item.cart_id || manual.lab_manual_id || Math.random();

                return (
                  <Grid item xs={12} sm={6} md={3} key={key} display="flex" justifyContent="center">
                    <Card
                      sx={{
                        width: { xs: 260, sm: 260, md: 280 },
                        height: { xs: 'auto', md: 360 },
                        borderRadius: 3,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'scale(1.03)',
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={manual.manual_image || '/placeholder.jpg'}
                        alt={manual.subjects?.name || 'Lab Manual'}
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
                          {manual.subjects?.name || 'Manual'}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            flexGrow: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {manual.manual_description || 'No description available.'}
                        </Typography>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                          ₹{manual.selling_price || 0} × {item.quantity} = ₹
                          {(manual.selling_price || 0) * item.quantity}
                        </Typography>

                        <Box display="flex" alignItems="center" mt={1}>
                          <IconButton onClick={() => handleDecrement(item)} size="small">
                            <Remove />
                          </IconButton>
                          <Typography>{item.quantity}</Typography>
                          <IconButton onClick={() => handleIncrement(item)} size="small">
                            <Add />
                          </IconButton>
                          <IconButton onClick={() => handleRemove(item)} size="small">
                            <Delete color="error" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 3,
                textAlign: 'right',
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Total: ₹{total}
              </Typography>
              <Box mt={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearCart}
                  sx={{ mr: 2 }}
                >
                  Clear Cart
                </Button>
                <RazorpayButton amount={total} />
              </Box>
            </Paper>
          </>
        )}
      </Paper>
    </Container>
    </Box>
  );
}

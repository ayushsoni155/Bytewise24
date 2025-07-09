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
  Alert,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useCart } from '../context/CartContext';

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

  useEffect(() => {
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (item.lab_manuals?.selling_price || 0) * item.quantity,
      0
    );
    setTotal(totalPrice);
  }, [cartItems]);

  const handleIncrement = (item) => {
    incrementQuantity(item.cart_id || item.lab_manual_id);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      decrementQuantity(item.cart_id || item.lab_manual_id);
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.cart_id || item.lab_manual_id);
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
          Your Cart
        </Typography>

        {loading ? (
          <Grid container spacing={3} justifyContent="center">
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ borderRadius: 3, boxShadow: 3, p: 1 }}>
                  <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
                  <CardContent>
                    <Skeleton width="80%" height={24} />
                    <Skeleton width="100%" height={20} />
                    <Skeleton width="60%" height={24} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : cartItems.length === 0 ? (
          <Typography variant="h6" align="center">
            Your cart is empty.
          </Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center">
              {cartItems.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.lab_manual_id || item.cart_id}>
                  <Card
                    sx={{
                      width: 280,
                      height: 380,
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
                      image={item.lab_manuals?.manual_image || '/placeholder.jpg'}
                      alt={item.lab_manuals?.subjects?.name}
                      sx={{ objectFit: 'cover' }}
                    />

                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {item.lab_manuals?.subjects?.name || 'Manual'}
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
                        {item.lab_manuals?.manual_description}
                      </Typography>

                      <Typography variant="body2" sx={{ mt: 1 }}>
                        ₹{item.lab_manuals?.selling_price} × {item.quantity} = ₹
                        {(item.lab_manuals?.selling_price || 0) * item.quantity}
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
              ))}
            </Grid>

            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 3,
                textAlign: 'right',
                borderRadius: 3,
                boxShadow:3 ,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Total: ₹{total}
              </Typography>
              <Box mt={2}>
                <Button variant="outlined" color="error" onClick={clearCart} sx={{ mr:2}}>
                  Clear Cart
                </Button>
                <Button variant="contained" color="primary">
                  Proceed to Payment
                </Button>
              </Box>
            </Paper>
          </>
        )}
      </Paper>
    </Container>
  );
}

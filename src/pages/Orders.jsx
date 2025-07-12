import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Grid,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from '../services/axios';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

export default function OrderHistory() {
  const { isLoggedIn } = useAuth();
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/orders/fetch-orders');
        setOrders(res.data.orders);
      } catch (err) {
        setNotification({ message: 'Failed to fetch orders', type: 'error', visible: true });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchOrders();
  }, [isLoggedIn]);

  const handleCancelOrder = async (order_id) => {
    try {
      await axios.delete('/orders/cancel-order', { data: { order_id } });
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === order_id ? { ...order, order_status: 'cancelled' } : order
        )
      );
      setNotification({ message: 'Order cancelled successfully', type: 'success', visible: true });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setNotification({ message: 'Failed to cancel order', type: 'error', visible: true });
    }
  };
const handleDownloadInvoice = (order) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(33, 150, 243); // Vibrant blue
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('ByteWise Invoice', 20, 25);
  
  // Logo placeholder (uncomment and add your logo image URL if available)
  // doc.addImage('logo.png', 'PNG', 160, 10, 30, 20);

  // Company Details
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('ByteWise', 150, 50);
  doc.text('Mit Ujjain', 150, 56);
  doc.text('Email: contact@bytewise.com', 150, 62);

  // Order Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Details', 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: ${order.order_id}`, 20, 60);
  doc.text(`Date: ${new Date(order.order_date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  })}`, 20, 68);
  doc.text(`Status: ${order.order_status}`, 20, 76);

  // Items Table
  const tableRows = order.order_items.map((item, idx) => [
    idx + 1,
    item.lab_manuals.subjects.name,
    item.lab_manuals.subject_code,
    item.quantity,
    `Rs.${item.item_price.toFixed(2)}`,
    `Rs.${(item.item_price * item.quantity).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 90,
    head: [['S.No', 'Item Name', 'Code', 'Qty', 'Unit Price', 'Total']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 11
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    margin: { left: 20, right: 20 },
    styles: {
      font: 'helvetica',
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 }
    }
  });

  // Total Amount
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFillColor(240, 240, 240);
  doc.rect(135, finalY - 5, 55, 10, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Amount: Rs.${order.total_price.toFixed(2)}`, 140, finalY + 2);

  // Footer
  doc.setFillColor(33, 150, 243);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for shopping with ByteWise!', 20, 288);
  doc.text('Contact us: support@bytewise.com | +91-6266898048', 120, 288);

//   // Add page border
//   doc.setDrawColor(200, 200, 200);
//   doc.setLineWidth(0.5);
//   doc.rect(10, 10, 190, 277);

  // Save the PDF
  doc.save(`Invoice_${order.order_id}.pdf`);
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'cancelled':
        return theme.palette.error.main;
      case 'delivered':
      case 'successfull':
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ minHeight: '100vh', mt: { xs: 9, sm: 10, md: 12 }, mb: { xs: 4, sm: 6 }, px: { xs: 1, sm: 2, md: 4, lg: 4 } }}
    >
      <Notification {...notification} onClose={() => setNotification({ ...notification, visible: false })} />

      <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600} align="center">
          My Orders
        </Typography>

        {loading ? (
          <Box textAlign="center" mt={4}><CircularProgress /></Box>
        ) : orders.length === 0 ? (
          <Typography align="center">No orders found.</Typography>
        ) : (
          orders.map((order) => (
            <Paper
              key={order.order_id}
              elevation={2}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                border: '1px solid',
                borderColor: theme.palette.divider,
                backgroundColor: theme.palette.background.paper,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 12px rgba(255,255,255,0.1)'
                    : '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                },
              }}
            >
              <Box display="flex" justifyContent="space-between" flexWrap="wrap" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                    Order ID: {order.order_id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.order_date).toLocaleString()}
                  </Typography>
                  <Chip
                    label={order.order_status.toUpperCase()}
                    size="medium"
                    sx={{
                      mt: 1,
                      fontWeight: 'bold',
                      letterSpacing: 0.6,
                      bgcolor: getStatusColor(order.order_status),
                      color: theme.palette.getContrastText(getStatusColor(order.order_status)),
                    }}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={2} mt={{ xs: 2, sm: 0 }}>
                  {order.order_status === 'pending' && (
                    <Button variant="contained" color="error" onClick={() => handleCancelOrder(order.order_id)} sx={{ fontWeight: 600, textTransform: 'none' }}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => handleDownloadInvoice(order)}
                    sx={{ fontWeight: 600, textTransform: 'none', borderColor: '#1976d2', color: '#1976d2', '&:hover': { backgroundColor: '#1976d2', color: '#fff' } }}
                  >
                    Download PDF
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {order.order_items.map((item, idx) => {
                  const manual = item.lab_manuals;
                  return (
                    <Grid item xs={12} key={idx}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: theme.palette.mode === 'dark' ? '#2c2c2c' : '#f7f7f7',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          border: '1px solid',
                          borderColor: theme.palette.divider,
                          transition: 'background-color 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? '#1e88e5' : '#e3f2fd',
                          },
                        }}
                      >
                        <Box>
                          <Typography fontWeight={600} color="text.primary">
                            {manual.subjects.name} ({manual.subject_code})
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            {manual.manual_description}
                          </Typography>
                        </Box>
                        <Box textAlign="right" minWidth={110}>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Price: ₹{item.item_price}
                          </Typography>
                          <Typography fontWeight={700} color="#1976d2" mt={0.5}>
                            ₹{item.quantity * item.item_price}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>
          ))
        )}
      </Paper>
    </Container>
  );
}
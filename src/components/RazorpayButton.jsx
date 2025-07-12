import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import { loadRazorpay } from "../utils/loadRazorpay";
import axios from "../services/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Notification from "../components/Notification";

export default function RazorpayButton({ amount }) {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();

  const [notify, setNotify] = useState({
    open: false,
    message: "",
    type: "info",
  });

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpay();
    if (!res) {
      setNotify({
        open: true,
        message: "Razorpay SDK failed to load.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create Razorpay order
      const orderRes = await axios.post("/payment/create-order", { amount });
      const { id: order_id, currency } = orderRes.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency,
        name: "ByteWise",
        description: "Lab Manual Purchase",
        image: "/logo-transparent-png.png",
        order_id,
        handler: async (response) => {
          // Step 3: Verify Payment
          const verifyRes = await axios.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            // Step 4: Save Order
            const formattedItems = cartItems.map((item) => ({
              lab_manual_id: item.lab_manual_id,
              quantity: item.quantity,
            }));

            await axios.post("/orders/place-order", {
              transaction_id: response.razorpay_payment_id,
              items: formattedItems,
            });

            clearCart();
            setNotify({
              open: true,
              message: "Payment successful and order placed!",
              type: "success",
            });
          } else {
            setNotify({
              open: true,
              message: " Payment verification failed.",
              type: "error",
            });
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "xyz@gmail.com",
          contact: user?.phone || "",
        },
        theme: {
          color: "#2E7D32",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setNotify({
              open: true,
              message: "Payment cancelled by user.",
              type: "info",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setNotify({
        open: true,
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handlePayment}
        variant="contained"
        color="success"
        startIcon={!loading && <PaymentIcon />}
        disabled={loading}
        sx={{
          fontWeight: "bold",
          textTransform: "none",
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : `Pay ₹${amount}`}
      </Button>

      <Notification
        open={notify.open}
        message={notify.message}
        type={notify.type}
        onClose={() => setNotify((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}

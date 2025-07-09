/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../services/axios';
import { useAuth } from './AuthContext';
import CryptoJS from 'crypto-js';

const CartContext = createContext();
const CART_KEY = import.meta.env.VITE_CART_KEY;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const encryptCart = (data) => {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    } catch {
      return '';
    }
  };

  const decryptCart = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      return [];
    }
  };

  const loadCart = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await axios.get('/cart/fetch-cart');
        setCartItems(res.data || []);
      } else {
        const saved = localStorage.getItem(CART_KEY);
        if (saved) setCartItems(decryptCart(saved));
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Load cart error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const addToCart = async (lab_manual_id, quantity = 1) => {
    if (!lab_manual_id || quantity <= 0) return;

    if (isLoggedIn) {
      try {
        await axios.post('/cart/add-to-cart', { lab_manual_id, quantity });
        await loadCart();
      } catch (err) {
        if (import.meta.env.DEV) console.error('Add to cart failed:', err);
      }
    } else {
      const updated = [...cartItems];
      const index = updated.findIndex((item) => item.lab_manual_id === lab_manual_id);
      if (index !== -1) updated[index].quantity = quantity;
      else updated.push({ lab_manual_id, quantity });
      console.log(updated);
      
      setCartItems(updated);
      localStorage.setItem(CART_KEY, encryptCart(updated));
    }
  };

  const removeFromCart = async (cart_id) => {
    if (!cart_id) return;

    if (isLoggedIn) {
      try {
        await axios.delete('/cart/delete-cart', { data: { cart_id } });
        await loadCart();
      } catch (err) {
        if (import.meta.env.DEV) console.error('Remove cart error:', err);
      }
    } else {
      const filtered = cartItems.filter((item) => item.lab_manual_id !== cart_id);
      setCartItems(filtered);
      localStorage.setItem(CART_KEY, encryptCart(filtered));
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        await axios.delete('/cart/clear-cart');
        setCartItems([]);
      } catch (err) {
        if (import.meta.env.DEV) console.error('Clear cart error:', err);
      }
    } else {
      localStorage.removeItem(CART_KEY);
      setCartItems([]);
    }
  };

  const syncLocalToServer = async () => {
    if (!isLoggedIn) return;

    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return;

    const localCart = decryptCart(saved);
    for (const item of localCart) {
      await addToCart(item.lab_manual_id, item.quantity);
    }
    localStorage.removeItem(CART_KEY);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  // INCREMENT quantity
  const incrementQuantity = async (cart_id) => {
    if (isLoggedIn) {
      const item = cartItems.find((i) => i.cart_id === cart_id);
      if (!item) return;
      await addToCart(item.lab_manual_id, item.quantity + 1);
    } else {
      const updated = cartItems.map((item) =>
        item.lab_manual_id === cart_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updated);
      localStorage.setItem(CART_KEY, encryptCart(updated));
    }
  };

  // DECREMENT quantity
  const decrementQuantity = async (cart_id) => {
    if (isLoggedIn) {
      const item = cartItems.find((i) => i.cart_id === cart_id);
      if (!item || item.quantity <= 1) return;
      await addToCart(item.lab_manual_id, item.quantity - 1);
    } else {
      const updated = cartItems.map((item) =>
        item.lab_manual_id === cart_id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      setCartItems(updated);
      localStorage.setItem(CART_KEY, encryptCart(updated));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartCount,
        syncLocalToServer,
        incrementQuantity,
        decrementQuantity,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 
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
  const [synced, setSynced] = useState(false);

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

  const saveToLocalStorage = (data) => {
    localStorage.setItem(CART_KEY, encryptCart(data));
  };

  // Load cart once on login or from localStorage
  const loadCart = async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        if (!synced) await syncLocalToServer();
        const res = await axios.get('/cart/fetch-cart');
        const data = res.data || [];
        setCartItems(data);
        saveToLocalStorage(data);
        setSynced(true);
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

  // Helper: update DB but don't reload cart (no fetch)
 // Pass cart_id for deletion, lab_manual_id for add/update
const updateDB = async (cart_id, lab_manual_id, newQuantity) => {
  if (!isLoggedIn) return;
  try {
    if (newQuantity <= 0) {
      // For delete, pass cart_id (not lab_manual_id)
      if (!cart_id) {
        if (import.meta.env.DEV) console.error('cart_id is required to delete cart item');
        return;
      }
      await axios.delete('/cart/delete-cart', { data: { cart_id } });
    } else {
      // For add/update, pass lab_manual_id and quantity
      await axios.post('/cart/add-to-cart', {
        lab_manual_id,
        quantity: newQuantity,
      });
    }
  } catch (err) {
    if (import.meta.env.DEV) console.error('DB update failed:', err);
  }
};

// When updating quantity, you only have lab_manual_id
const addToCart = (item, quantityDelta = 1) => {
  if (!item?.lab_manual_id || quantityDelta === 0) return;

  const updated = [...cartItems];
  const index = updated.findIndex((i) => i.lab_manual_id === item.lab_manual_id);

  if (index !== -1) {
    updated[index].quantity += quantityDelta;
    if (updated[index].quantity <= 0) {
      // Remove locally
      updated.splice(index, 1);
      // Update DB using cart_id to delete
      if (isLoggedIn) {
        updateDB(item.cart_id || updated[index]?.cart_id, item.lab_manual_id, 0);
      }
      setCartItems(updated);
      saveToLocalStorage(updated);
      return;
    }
  } else {
    updated.push({ ...item, quantity: quantityDelta });
  }

  setCartItems(updated);
  saveToLocalStorage(updated);

  if (isLoggedIn) {
    // update DB quantity
    const itemForDB = updated.find((i) => i.lab_manual_id === item.lab_manual_id);
    updateDB(itemForDB.cart_id, item.lab_manual_id, itemForDB ? itemForDB.quantity : 0);
  }
};

// Remove function now receives entire item, not just id
const removeFromCart = (item) => {
  if (!item) return;
  const updated = cartItems.filter(
    (i) => i.lab_manual_id !== item.lab_manual_id && i.cart_id !== item.cart_id
  );
  setCartItems(updated);
  saveToLocalStorage(updated);

  if (isLoggedIn) {
    updateDB(item.cart_id, item.lab_manual_id, 0);
  }
};

  // Clear all locally and on server
  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    setCartItems([]);
    if (isLoggedIn) {
      axios.delete('/cart/clear-cart').catch((err) => {
        if (import.meta.env.DEV) console.error('Clear cart error:', err);
      });
    }
  };

  // Increment locally + update DB async
  const incrementQuantity = (item) => {
    if (!item) return;
    addToCart(item, 1);
  };

  // Decrement locally + update DB async
  const decrementQuantity = (item) => {
    if (!item || item.quantity <= 1) return;
    addToCart(item, -1);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const syncLocalToServer = async () => {
    const saved = localStorage.getItem(CART_KEY);
    if (!saved) return setSynced(true);

    const localCart = decryptCart(saved);
    if (localCart.length === 0) return setSynced(true);

    try {
      const serverRes = await axios.get('/cart/fetch-cart');
      const serverItems = serverRes.data || [];
      const serverIds = new Set(serverItems.map((i) => i.lab_manual_id));

      const newItems = localCart.filter((i) => !serverIds.has(i.lab_manual_id));

      for (const item of newItems) {
        await axios.post('/cart/add-to-cart', {
          lab_manual_id: item.lab_manual_id,
          quantity: item.quantity,
        });
      }

      localStorage.removeItem(CART_KEY);
      setSynced(true);
    } catch (err) {
      if (import.meta.env.DEV) console.error('Sync error:', err);
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
        incrementQuantity,
        decrementQuantity,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

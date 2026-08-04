import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext(null);
const CART_KEY = 'emberVineCart';
const TAX_RATE = 0.10;

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    if (!Array.isArray(parsed)) return [];
    // Drop any leftover items saved by an older version of the site
    // that didn't store a menu_item_id — sending those to the API
    // would fail server-side validation.
    return parsed.filter((item) => typeof item.id === 'number');
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState('cart'); // 'cart' | 'invoice' | 'success'
  const [toast, setToast] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null); // { order_no, total, ... } from the API
  const { token } = useAuth();

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  function addToCart(id, name, price) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id, name, price, qty: 1 }];
    });
    setToast(`${name} added to your order`);
  }

  function changeQty(id, delta) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  function openDrawer() {
    setView('cart');
    setOrderError('');
    setDrawerOpen(true);
  }
  function closeDrawer() {
    setDrawerOpen(false);
  }
  function goToInvoice() {
    if (cart.length === 0) return;
    setOrderError('');
    setView('invoice');
  }
  function backToCart() {
    setView('cart');
  }

  /**
   * Submits the cart to POST /api/orders. The server looks up each dish's
   * real price by id and computes subtotal/tax/total itself — the client
   * only ever sends { menu_item_id, quantity } pairs.
   */
  async function confirmOrder() {
    if (!token) {
      setOrderError('You need to be signed in to place an order.');
      return;
    }
    const invalid = cart.some((i) => typeof i.id !== 'number');
    if (invalid) {
      setOrderError('One of the items in your cart is out of date. Please remove it and add it again from the Menu.');
      return;
    }
    setPlacingOrder(true);
    setOrderError('');
    try {
      const items = cart.map((i) => ({ menu_item_id: i.id, quantity: i.qty }));
      const order = await api.createOrder(token, items);
      setPlacedOrder(order);
      setView('success');
      clearCart();
    } catch (err) {
      setOrderError(err.message || 'Could not place your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  }

  const value = {
    cart, subtotal, tax, total, count,
    addToCart, changeQty, removeFromCart, clearCart,
    drawerOpen, openDrawer, closeDrawer,
    view, goToInvoice, backToCart, confirmOrder,
    placingOrder, orderError, placedOrder,
    toast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

import { useEffect, useState } from 'react';

export type CartItem = {
  productId: number;
  count: number;
};

export type Cart = {
  items: Record<number, CartItem>;
};

const STORAGE_EVENT_NAME = 'storage';
const CART_STORAGE_KEY = 'admin-product-cart';

// Coerce whatever is stored into a clean Record<number, CartItem>, keyed by
// productId. Tolerates legacy/corrupt values such as arrays (which can contain
// `null` holes once serialized) so consumers never dereference a null item.
const normalizeItems = (rawItems: unknown): Record<number, CartItem> => {
  const items: Record<number, CartItem> = {};
  if (!rawItems || typeof rawItems !== 'object') {
    return items;
  }

  for (const value of Object.values(rawItems)) {
    if (
      !value ||
      typeof value !== 'object' ||
      !('productId' in value) ||
      !('count' in value)
    ) {
      continue;
    }
    const productId = Number((value as CartItem).productId);
    const count = Number((value as CartItem).count);
    if (Number.isNaN(productId) || Number.isNaN(count)) {
      continue;
    }
    items[productId] = { productId, count };
  }

  return items;
};

// Get cart from localStorage
export const getCart = (): Cart => {
  if (typeof window === 'undefined') {
    return { items: {} };
  }

  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (!storedCart) {
    return { items: {} };
  }

  try {
    const parsed = JSON.parse(storedCart);
    return { items: normalizeItems(parsed?.items) };
  } catch (e) {
    console.error('Failed to parse cart from localStorage', e);
    return { items: {} };
  }
};

// Save cart to localStorage
export const saveCart = (cart: Cart): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

// Add item to cart
export const addToCart = (productId: number, count: number): void => {
  const cart = getCart();
  cart.items[productId] = { productId, count };
  saveCart(cart);
};

// Remove item from cart
export const removeFromCart = (productId: number): void => {
  const cart = getCart();
  delete cart.items[productId];
  saveCart(cart);
};

// Get cart item count
export const getCartItemCount = (): number => {
  const cart = getCart();
  return Object.values(cart.items).reduce(
    (accumulate, item) => item.count + accumulate,
    0,
  );
};

// Custom hook for cart
export const useCart = () => {
  const [cart, setCart] = useState<Cart>({ items: {} });
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCart(getCart());
    setCount(getCartItemCount());

    const handleStorageChange = () => {
      setCart(getCart());
      setCount(getCartItemCount());
    };
    window.addEventListener(STORAGE_EVENT_NAME, handleStorageChange);
    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, handleStorageChange);
    };
  }, []);

  const addItem = (productId: number, count: number) => {
    addToCart(productId, count);
    setCart(getCart());
    setCount(getCartItemCount());
    window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
  };

  const removeItem = (productId: number) => {
    removeFromCart(productId);
    setCart(getCart());
    setCount(getCartItemCount());
    window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
  };

  const replaceItems = (cart: Cart) => {
    saveCart(cart);
    window.dispatchEvent(new Event(STORAGE_EVENT_NAME));
  };

  return {
    cart,
    count,
    addItem,
    removeItem,
    replaceItems,
  };
};

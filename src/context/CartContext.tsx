import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Card } from "../types";

export interface CartItem {
  card: Card;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (card: Card) => void;
  removeFromCart: (cardId: string) => void;
  setQuantity: (cardId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((card: Card) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.card.id === card.id);
      if (existing) {
        return prev.map((item) =>
          item.card.id === card.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { card, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((cardId: string) => {
    setItems((prev) => prev.filter((item) => item.card.id !== cardId));
  }, []);

  const setQuantity = useCallback((cardId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.card.id !== cardId);
      }
      return prev.map((item) =>
        item.card.id === cardId ? { ...item, quantity } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.card.price, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
    }),
    [items, totalItems, totalPrice, addToCart, removeFromCart, setQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return ctx;
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  detailedItems: Array<CartItem & { product: Product }>;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "splax-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        if (response.ok) {
          setAllProducts(await response.json());
        }
      } catch {
        setAllProducts(products);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [isReady, items]);

  const detailedItems = useMemo(
    () =>
      items
        .map((item) => ({
          ...item,
          product: allProducts.find((product) => product.id === item.productId)
        }))
        .filter((item): item is CartItem & { product: Product } => Boolean(item.product)),
    [allProducts, items]
  );

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = detailedItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    return {
      items,
      detailedItems,
      count,
      subtotal,
      addItem(productId, quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.productId === productId);
          if (existing) {
            return current.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(item.quantity + quantity, 10) }
                : item
            );
          }
          return [...current, { productId, quantity }];
        });
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      updateQuantity(productId, quantity) {
        if (quantity < 1) {
          setItems((current) => current.filter((item) => item.productId !== productId));
          return;
        }
        setItems((current) =>
          current.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.min(quantity, 10) } : item
          )
        );
      },
      clearCart() {
        setItems([]);
      }
    };
  }, [detailedItems, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
